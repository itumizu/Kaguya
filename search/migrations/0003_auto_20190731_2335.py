# Generated by Django 2.2 on 2019-07-31 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0002_auto_20190731_2322'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='作成日時'),
        ),
        migrations.AlterField(
            model_name='author',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='更新日時'),
        ),
        migrations.AlterField(
            model_name='collection',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='作成日時'),
        ),
        migrations.AlterField(
            model_name='collection',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='更新日時'),
        ),
        migrations.AlterField(
            model_name='haikai',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='作成日時'),
        ),
        migrations.AlterField(
            model_name='haikai',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='更新日時'),
        ),
        migrations.AlterField(
            model_name='koten',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='作成日時'),
        ),
        migrations.AlterField(
            model_name='koten',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='更新日時'),
        ),
        migrations.AlterField(
            model_name='tanka',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='作成日時'),
        ),
        migrations.AlterField(
            model_name='tanka',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='更新日時'),
        ),
        migrations.AlterField(
            model_name='year',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='作成日時'),
        ),
        migrations.AlterField(
            model_name='year',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='更新日時'),
        ),
    ]
