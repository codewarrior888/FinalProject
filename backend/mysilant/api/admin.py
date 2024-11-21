from django.contrib import admin
from django.utils.html import format_html
from .models import (Reference, Equipment, Maintenance, Claim)


class ReferenceAdmin(admin.ModelAdmin):
    model = Reference
    list_display = ('description_with_breaks',)

    def description_with_breaks(self, obj):
        return format_html(obj.description.replace('\n', '<br>'))


admin.site.register(Reference)
admin.site.register(Equipment)
admin.site.register(Maintenance)
admin.site.register(Claim)
