from .models import Agent, HistoricalAgent
from .serializers import AgentHistorySerializer, AgentSerializer
from server.core.filters import (
    CamelCaseDjangoFilterBackend,
    CamelCaseOrderingFilter,
)
from server.users.models import User
from server.users.permissions import IsAnyRole
from rest_framework import filters
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_extensions.mixins import NestedViewSetMixin


class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = (
        IsAuthenticated,
        IsAnyRole([User.EDITOR, User.USER, User.ADMIN]),
    )
    filter_backends = (
        filters.SearchFilter,
        CamelCaseOrderingFilter,
        CamelCaseDjangoFilterBackend,
    )
    filterset_fields = {
        "email": ["icontains", "istartswith", "iendswith", "iexact"],
        "name": ["icontains", "istartswith", "iendswith", "iexact"],
        "phone_number": ["icontains", "istartswith", "iendswith", "iexact"],
    }
    search_fields = ["email", "name", "phone_number"]


class AgentHistoryViewSet(
    NestedViewSetMixin, viewsets.GenericViewSet, mixins.ListModelMixin
):
    serializer_class = AgentHistorySerializer

    def get_queryset(self):
        return self.filter_queryset_by_parents_lookups(
            HistoricalAgent.objects.order_by('-history_date').select_related("history_user")
        )
