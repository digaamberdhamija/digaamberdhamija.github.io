# Generated by Django 3.0.2 on 2020-03-31 07:57

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('sky', '0007_auto_20200331_1323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='datetime',
            field=models.DateTimeField(default=datetime.datetime(2020, 3, 31, 7, 57, 56, 663037, tzinfo=utc)),
        ),
    ]
