import logging
import sys

import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
import graphene_django_optimizer as gql_optimizer
from graphql_relay import from_global_id

from search.models import Haikai, Author, Collection, Year
from .schema import HaikaiType

class CreateHaikai(graphene.Mutation):
    class Arguments:
        number = graphene.Int(required=True)

        firstPart = graphene.String()
        secondPart = graphene.String()
        lastPart = graphene.String()
        firstPartKana = graphene.String()
        secondPartKana = graphene.String()
        lastPartKana = graphene.String()
        description =  graphene.String()

        author = graphene.ID(required=True)
        collection = graphene.ID(required=True)
        year = graphene.ID()
    
    haikai = graphene.Field(HaikaiType)

    def mutate(self, info, number, firstPart, secondPart, lastPart, firstPartKana, secondPartKana, lastPartKana, description, author, collection, year):
        collection = Collection.objects.get(id=from_global_id(collection)[1])
        author = Author.objects.get(id=from_global_id(author)[1])
        if year:
            year = Year.objects.get(id=from_global_id(year)[1])
        
        try:
            if year:
                haikai = Haikai.objects.create(number=number, firstPart=firstPart, secondPart=secondPart, lastPart=lastPart, firstPartKana=firstPartKana, secondPartKana=secondPartKana, lastPartKana=lastPartKana, collection=collection, author=author)
            else:
                haikai = Haikai.objects.create(number=number, firstPart=firstPart, secondPart=secondPart, lastPart=lastPart, firstPartKana=firstPartKana, secondPartKana=secondPartKana, lastPartKana=lastPartKana, collection=collection, author=author, year=year)
        
        except:
            logging.debug(sys.exc_info())
            return sys.exc_info()[0]

        return haikai

class Mutation(graphene.ObjectType):
    # JWT
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field
    
    createuser = CreateHaikai.Field()