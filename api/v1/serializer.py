import re

from django.db.models import Q
from rest_framework import serializers
from rest_framework.serializers import SerializerMethodField
from django_filters import rest_framework as filters

from search.models import Haikai, Tanka, Koten, Author, Collection, Year
from users.models import User

class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class CollectionListSerializer(serializers.ModelSerializer):
    childCollection = RecursiveField(many=True)
    parent = SerializerMethodField()

    def get_parent(self, obj):
        if obj.parent is not None:
            return CollectionSerializer(obj.parent).data
        else:
            return None

    class Meta:
        model = Collection
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class CollectionSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Collection
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class HaikaiSerializer(serializers.ModelSerializer):

    class Meta:
        model = Haikai
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class TankaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tanka
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class KotenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Koten
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class HaikaiListSerializer(HaikaiSerializer):
    collection = CollectionListSerializer()
    author = AuthorSerializer()
    year = YearSerializer()

class TankaListSerializer(TankaSerializer):
    collection = CollectionListSerializer()
    author = AuthorSerializer()
    year = YearSerializer()

class KotenListSerializer(KotenSerializer):
    collection = CollectionListSerializer()
    author = AuthorSerializer()
    year = YearSerializer()


class HaikaiFilter(filters.FilterSet):

    # フィルタの定義
    # firstPart = filters.CharFilter(lookup_expr='contains')
    # secondPart = filters.CharFilter(lookup_expr='contains')
    # lastPart = filters.CharFilter(lookup_expr='contains')
    query = filters.CharFilter(field_name='query', method='search', label="query")

    class Meta:
        model = Haikai
        fields = ['query']
    
    def search(self, queryset, name, value):
        words = re.split(r"\s", value)
        queries = [Q(firstPart__contains=word) | Q(secondPart__contains=word) | Q(lastPart__contains=word) | Q(firstPartKana__contains=word) | Q(secondPartKana__contains=word) | Q(lastPartKana__contains=word) | Q(collection__name__contains=word) | Q(collection__parent__name__contains=word) | Q(author__name__contains=word) for word in words]
        query = queries.pop()
        
        for item in queries:
            (query) &= item

        return queryset.filter(query).select_related('author', 'collection', 'collection__parent')