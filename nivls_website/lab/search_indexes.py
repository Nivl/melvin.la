from haystack.indexes import *
from haystack import site
from models import Project


class ProjectIndex(RealTimeSearchIndex):
    text = CharField(document=True, use_template=True)
    pub_date = DateTimeField(model_attr='start_date')
    site_id = IntegerField(model_attr='site__site__pk')

    def index_queryset(self):
        return Project.objects.all()

site.register(Project, ProjectIndex)
