# Generated by Django 5.1.2 on 2024-11-19 00:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_maintenance_maintenance_company'),
    ]

    operations = [
        migrations.RenameField(
            model_name='maintenance',
            old_name='maintenance_company',
            new_name='maintenance_company_name',
        ),
    ]