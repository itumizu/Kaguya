from rest_framework import viewsets, filters

from users.models import User
from search.models import Haikai, Tanka, Koten, Collection, Author, Year
from .serializer import HaikaiSerializer, TankaSerializer, KotenSerializer, \
    HaikaiListSerializer, TankaListSerializer, KotenListSerializer, \
    CollectionSerializer, AuthorSerializer, YearSerializer, UserSerializer, CollectionListSerializer, \
    HaikaiFilter, TankaFilter, KotenFilter, CollectionFilter, AuthorFilter
    

class HaikaiViewSet(viewsets.ModelViewSet):
    queryset = Haikai.objects.all()
    filter_class = HaikaiFilter
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return HaikaiListSerializer
        return HaikaiSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class TankaViewSet(viewsets.ModelViewSet):
    queryset = Tanka.objects.all()
    filter_class = TankaFilter

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return TankaListSerializer
        return TankaSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class KotenViewSet(viewsets.ModelViewSet):
    queryset = Koten.objects.all()
    filter_class = KotenFilter

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return KotenListSerializer
        return KotenSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    filter_class = CollectionFilter

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return CollectionListSerializer
        return CollectionSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    filter_class = AuthorFilter

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class YearViewSet(viewsets.ModelViewSet):
    queryset = Year.objects.all()
    serializer_class = YearSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
        
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)