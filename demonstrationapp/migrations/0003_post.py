# Generated by Django 3.2.21 on 2023-09-15 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demonstrationapp', '0002_futurerate'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=25)),
                ('slug', models.SlugField()),
                ('intro', models.TextField()),
                ('body', models.TextField()),
                ('posted_date', models.DateField(auto_now_add=True)),
            ],
        ),
    ]
