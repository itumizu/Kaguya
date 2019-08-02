import graphene
from search.query import Query as searchQuery
from search.mutation import Mutation as searchMutation

class Query(searchQuery, graphene.ObjectType):
    pass

class Mutation(searchMutation, graphene.ObjectType):
    pass

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)