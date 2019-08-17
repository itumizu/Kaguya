# Generated by Django 2.2 on 2019-07-31 14:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('search', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='created_author_user', to=settings.AUTH_USER_MODEL, verbose_name='作成者'),
        ),
        migrations.AddField(
            model_name='author',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='updated_author_user', to=settings.AUTH_USER_MODEL, verbose_name='更新者'),
        ),
        migrations.AddField(
            model_name='collection',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='created_collection_user', to=settings.AUTH_USER_MODEL, verbose_name='作成者'),
        ),
        migrations.AddField(
            model_name='collection',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='updated_collection_user', to=settings.AUTH_USER_MODEL, verbose_name='更新者'),
        ),
        migrations.AddField(
            model_name='koten',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='created_koten_user', to=settings.AUTH_USER_MODEL, verbose_name='作成者'),
        ),
        migrations.AddField(
            model_name='koten',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='updated_koten_user', to=settings.AUTH_USER_MODEL, verbose_name='更新者'),
        ),
        migrations.AddField(
            model_name='tanka',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='created_tanka_user', to=settings.AUTH_USER_MODEL, verbose_name='作成者'),
        ),
        migrations.AddField(
            model_name='tanka',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='updated_tanka_user', to=settings.AUTH_USER_MODEL, verbose_name='更新者'),
        ),
        migrations.AddField(
            model_name='year',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='created_year_user', to=settings.AUTH_USER_MODEL, verbose_name='作成者'),
        ),
        migrations.AddField(
            model_name='year',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='updated_year_user', to=settings.AUTH_USER_MODEL, verbose_name='更新者'),
        ),
        migrations.AlterField(
            model_name='haikai',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='created_haikai_user', to=settings.AUTH_USER_MODEL, verbose_name='作成者'),
        ),
        migrations.AlterField(
            model_name='haikai',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='updated_haikai_user', to=settings.AUTH_USER_MODEL, verbose_name='更新者'),
        ),
    ]