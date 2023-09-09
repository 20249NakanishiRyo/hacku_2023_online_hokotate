from django.views.generic import TemplateView
from django.http import JsonResponse
from datetime import datetime,timedelta
from pandas_datareader import data
import pandas as pd
import numpy as np
import yfinance as yf
#import plotly.graph_objects as go
from dotenv import load_dotenv
import os
from django.views.generic.base import TemplateView
from .models import RateModel

class dashboardView(TemplateView):
    template_name = 'dashboard.html'

def get_chart(request):
    load_dotenv()
    api = os.getenv("API_KEY")
    start = datetime.strptime(request.POST.get("start"), '%Y-%m-%d')
    end = datetime.strptime(request.POST.get("end"), '%Y-%m-%d')
    #yf.pdr_override()
    #df = data.get_data_yahoo('JPY=X',start,end)
    df = data.get_data_alphavantage('USDJPY', api_key=api, start=start, end=end)
    df['date'] = df.index
    #print(df)
    #追加
    # DBに保存する前に、既存のデータを削除する 
    RateModel.objects.all().delete()
    # チャートのデータをDBに保存する
    for index, row in df.iterrows():
        RateModel = RateModel(date=row['date'], open=row['open'], high=row['high'], low=row['low'], close=row['close'])
        RateModel.save()
    # 日付一覧を取得
    # d_all = pd.date_range(start=df.index[0],end=df.index[-1])
    
    # #株価データの日付リストを取得
    # d_obs = [d for d in df.index]
    
    # # 株価データの日付データに含まれていない日付を抽出
    # d_breaks = [d for d in d_all.strftime("%Y-%m-%d").tolist() if not d in d_obs]
    # fig = go.Figure(
    #     data= [go.Candlestick(
    #                x = df['date'], 
    #                open=df['open'],
    #                high=df['high'],
    #                low=df['low'],
    #                close=df['close'])
    #     ]
    # )
    # fig.update(layout_xaxis_rangeslider_visible=False)
    # fig.update_xaxes(
    #     rangebreaks=[dict(values=d_breaks)], # 非営業日を非表示設定
    #     tickformat='%Y/%m/%d' # 日付のフォーマット変更
    # )
    # fig.write_image("test.png")
    return JsonResponse(data=df.to_json(orient='records'), safe=False)