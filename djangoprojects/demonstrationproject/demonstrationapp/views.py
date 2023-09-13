from django.views.generic import TemplateView
from django.http import JsonResponse
from django.db import connection
from datetime import datetime,timedelta
from pandas_datareader import data
import pandas as pd
import numpy as np
import tensorflow as tf
from dotenv import load_dotenv
import os
from django.views.generic.base import TemplateView
from .models import RateModel
from .models import FutureRate
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation
from tensorflow.keras.layers import LSTM
from tensorflow.keras.optimizers import Adam

class dashboardView(TemplateView):
    template_name = 'dashboard.html'

def get_chart(request):
    load_dotenv()
    api = os.getenv("API_KEY")
    start = datetime.strptime(request.POST.get("start"), '%Y-%m-%d')
    end = datetime.today().date()
    columns = ['date', 'open', 'high', 'low', 'close']
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM demonstrationapp_ratemodel WHERE date = %s;", [end])
        result = cursor.fetchone()[0]
    if (result > 0):
        pass
    else:
        df = data.get_data_alphavantage('USDJPY', api_key=api, start=start, end=end)
        df['date'] = df.index
        #追加
        # DBに保存する前に、既存のデータを削除する 
        #RateModel.objects.all().delete()
        # チャートのデータをDBに保存する
        for index, row in df.iterrows():
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM demonstrationapp_ratemodel WHERE date = %s;", [row['date']])
                result = cursor.fetchone()[0]
            if (result > 0):
                continue
            model = RateModel(date=row['date'], open=row['open'], high=row['high'], low=row['low'], close=row['close'])
            model.save()
    with connection.cursor() as cursor:
        cursor.execute("SELECT date, open, high, low, close FROM demonstrationapp_ratemodel ORDER BY date ASC;")
        result = cursor.fetchall()
    df = pd.DataFrame(result, columns=columns)
    return JsonResponse(data=df.to_json(orient='records'), safe=False)

def predict_chart(request):
    next_day = datetime.now() + timedelta(days=1)
    next_day = next_day.date()
    columns = ['date', 'close', 'sma01', 'sma02', 'sma03']
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM demonstrationapp_futurerate WHERE date = %s;", [next_day])
        result = cursor.fetchone()[0]
    if (result > 0):
        pass
    else:
        load_dotenv()
        api = os.getenv("API_KEY")
        start = datetime.strptime(request.POST.get("start"), '%Y-%m-%d')
        end = datetime.today().date()
        df = data.get_data_alphavantage('USDJPY', api_key=api, start=start, end=end)
        price=df['close']
        data_technical=df.copy()
        span01=5
        span02=10
        span03=15
        data_technical['sma01']=price.rolling(window=span01).mean()
        data_technical['sma02']=price.rolling(window=span02).mean()
        data_technical['sma03']=price.rolling(window=span03).mean()
        data_technical=data_technical.dropna(how='any')
        data_technical=data_technical.drop(['open', 'volume', 'high','low',], axis=1)
        scaler= MinMaxScaler(feature_range=(0,1))
        data_scale = pd.DataFrame(scaler.fit_transform(data_technical),index=data_technical.index,columns=data_technical.columns)
        data_scale_train = data_scale["2012":"2022"]
        data_scale_test  = data_scale["2022":"2024"]
        # 過去何日分のデータを見るか
        look_back = 30
        # 訓練用データセットの作成
        y_train,X_train = create_input_data(
            data=data_scale_train,
            look_back=look_back
        )
        # テスト用データセットの作成
        y_test,X_test = create_input_data(
            data=data_scale_test,
            look_back=look_back
        )

        model = Sequential()
        x = model.add(LSTM(12, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
        model.add(LSTM(8))
        model.add(Dense(len(data_scale.columns))) #出力層はデータ数に合わせる

        model.compile(loss='mean_squared_error', optimizer='adam')

        history = model.fit(X_train, y_train, epochs=50, batch_size=1)

        model.evaluate(X_train,y_train,batch_size=1)
        model.evaluate(X_test,y_test,batch_size=1)

        model.save('chart_model.keras')

        # model = tf.keras.models.load_model("chart_model.h5")

        X_future = [data_scale_test[-look_back:].values.tolist()] 
        y_future_list = []

        y_future = model.predict(X_future) 
        y_future_list.append(y_future[0]) 
        X_future = [X_future[0][1:] + y_future.tolist()]

        df_week_future = pd.DataFrame(scaler.inverse_transform(y_future_list), index=pd.date_range(next_day, periods=1, freq='D'),columns=data_technical.columns) 
        df_week_future['date'] = df_week_future.index
        FutureRate.objects.all().delete()
        for index, row in df_week_future.iterrows():
            future_data = FutureRate(date=row['date'], close=row['close'], sma01=row['sma01'], sma02=row['sma02'], sma03=row['sma03'])
            future_data.save()
    with connection.cursor() as cursor:
        cursor.execute("SELECT date, close, sma01, sma02, sma03 FROM demonstrationapp_futurerate;")
        result = cursor.fetchall()
    df = pd.DataFrame(result, columns=columns)
    return JsonResponse(data=df.to_json(orient='records'), safe=False)

def create_input_data(data, look_back):
    # データを転置してリストに変換
    raw_data = data.T.values.tolist()
    # データサイズを計算
    data_size = len(data) - look_back

    # 入力データの空のリストを作成
    X = [[] for i in range(len(raw_data))]
    # 出力データの空のリストを作成
    y = [[] for i in range(len(raw_data))]

    for i in range(data_size):
        for j in range(len(raw_data)):
            # 過去look_back分のデータを入力として追加
            X[j].append(raw_data[j][i:i + look_back])
            # 現在のデータを出力として追加
            y[j].append([raw_data[j][i + look_back]])

    # 最後の要素をX_tmpに代入
    X_tmp = X[-1]
    # 最後の要素をy_tmpに代入
    y_tmp = y[-1]

    for i in range(len(raw_data)-1):
        # 過去のデータを挿入していく
        X_tmp = np.insert(X_tmp,np.arange(0, (look_back-1)*(i+1)+1, i+1),X[-i-2],axis=1)
        y_tmp = np.insert(y_tmp,np.arange(0, (i+1), i+1),y[-i-2],axis=1)

    # 入力データと出力データをnumpy配列に変換し、形状を整える
    X = np.array(X_tmp).reshape(data_size, look_back, len(raw_data))
    y = np.array(y_tmp).reshape(data_size, 1,  len(raw_data))

    return y, X