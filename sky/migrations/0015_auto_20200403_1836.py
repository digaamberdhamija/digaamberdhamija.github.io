# Generated by Django 3.0.2 on 2020-04-03 13:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('sky', '0014_note'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectStat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='ProjectUpdate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.AlterField(
            model_name='note',
            name='text',
            field=models.TextField(max_length=4096),
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField(max_length=8192)),
                ('datetime', models.DateTimeField(default=django.utils.timezone.now)),
                ('starter', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='starter', to=settings.AUTH_USER_MODEL)),
                ('stats', models.ManyToManyField(blank=True, related_name='stats', to='sky.ProjectStat')),
                ('teams', models.ManyToManyField(blank=True, related_name='teams', to='sky.Team')),
                ('updates', models.ManyToManyField(blank=True, related_name='updates', to='sky.ProjectUpdate')),
            ],
        ),
    ]
