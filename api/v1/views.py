from rest_framework import viewsets, filters

from users.models import User
from search.models import Haikai, Tanka, Koten, Collection, Author, Year
from .serializer import HaikaiSerializer, TankaSerializer, KotenSerializer, \
    HaikaiListSerializer, TankaListSerializer, KotenListSerializer, \
    CollectionSerializer, AuthorSerializer, YearSerializer, UserSerializer, CollectionListSerializer, \
    HaikaiFilter
    

class HaikaiViewSet(viewsets.ModelViewSet):
    queryset = Haikai.objects.all()
    filter_class = HaikaiFilter
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return HaikaiListSerializer
        return HaikaiSerializer

class TankaViewSet(viewsets.ModelViewSet):
    queryset = Tanka.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return TankaListSerializer
        return KotenSerializer

class KotenViewSet(viewsets.ModelViewSet):
    queryset = Koten.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return KotenListSerializer
        return KotenSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return CollectionListSerializer
        return CollectionSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class YearViewSet(viewsets.ModelViewSet):
    queryset = Year.objects.all()
    serializer_class = YearSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
