from django.contrib import admin
from .models import Collection, Author, Year, Haikai, Tanka

class CollectionInline (admin.TabularInline):
    model = Collection
    extra = 0

class HaikaiInline (admin.TabularInline):
    model = Haikai
    extra = 0

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent',)
    search_fields = ('name', 'parent__name', )

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )

@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    list_display = ('jpnYear', 'adYear', )
    search_fields = ('jpnYear', 'adYear', )

@admin.register(Haikai)
class HaikaiAdmin(admin.ModelAdmin):
    list_display = ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'author', 'collection', 'year')
    search_fields = ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'author__name', 'collection__name', 'collection__parent__name', )

@admin.register(Tanka)
class TankaAdmin(admin.ModelAdmin):
    list_display = ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana', 'lastPartKana', 'collection', )
    search_fields = ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana','lastPartKana', 'collection__name', 'collection__parent__name', )
