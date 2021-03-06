# Generated by Django 3.0.2 on 2020-04-03 13:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sky', '0016_project_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='starter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='started_projects', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='project',
            name='stats',
            field=models.ManyToManyField(blank=True, related_name='projects', to='sky.ProjectStat'),
        ),
        migrations.AlterField(
            model_name='project',
            name='teams',
            field=models.ManyToManyField(blank=True, related_name='projects', to='sky.Team'),
        ),
        migrations.AlterField(
            model_name='project',
            name='updates',
            field=models.ManyToManyField(blank=True, related_name='projects', to='sky.ProjectUpdate'),
        ),
    ]
