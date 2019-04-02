from django.contrib import admin
from .models import Collection, Haikai, Tanka

@admin.register(Haikai)
class HaikaiAdmin(admin.ModelAdmin):
    list_display = ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'collection', )
    search_fields = ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'collection__name', 'collection__parent__name', )

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent',)
    search_fields = ('name', 'parent__name', )

@admin.register(Tanka)
class TankaAdmin(admin.ModelAdmin):
    list_display = ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana', 'lastPartKana', 'collection', )
    search_fields = ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana','lastPartKana', 'collection__name', 'collection__parent__name', )
