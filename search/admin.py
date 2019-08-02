from django.contrib import admin
from .models import Collection, Author, Year, Haikai, Tanka, Koten
from markdownx.admin import MarkdownxModelAdmin

class CollectionInline (admin.TabularInline):
    model = Collection
    extra = 0

class HaikaiInline (admin.TabularInline):
    model = Haikai
    extra = 0

@admin.register(Collection)
class CollectionAdmin(MarkdownxModelAdmin):
    list_display = ('name', 'parent', 'description', )
    search_fields = ('name', 'parent__name', 'description', )
    readonly_fields=('id', 'created_at', 'updated_at')

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', )
    search_fields = ('name', 'description', )
    readonly_fields=('id', 'created_at', 'updated_at')

@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    list_display = ('jpnYear', 'adYear', )
    search_fields = ('jpnYear', 'adYear', )
    readonly_fields=('id', 'created_at', 'updated_at')

@admin.register(Haikai)
class HaikaiAdmin(MarkdownxModelAdmin):
    list_display = ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'author', 'collection', 'description', 'year')
    search_fields = ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'author__name', 'collection__name', 'collection__parent__name', 'description', )
    readonly_fields=('id', 'created_at', 'updated_at')

@admin.register(Tanka)
class TankaAdmin(MarkdownxModelAdmin):
    list_display = ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana', 'lastPartKana', 'collection', 'author', 'description', 'year', )
    search_fields = ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana','lastPartKana', 'collection__name', 'collection__parent__name', 'description', )
    readonly_fields=('id', 'created_at', 'updated_at')

@admin.register(Koten)
class KotenAdmin(MarkdownxModelAdmin):
    list_display = ('text', 'description', 'collection', 'author', 'year',)
    search_fields = ('text', 'description', 'collection__name', 'collection__parent__name', )
    readonly_fields=('id', 'created_at', 'updated_at')