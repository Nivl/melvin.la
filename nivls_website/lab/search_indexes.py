from haystack.indexes import *
from haystack import site
from models import Project

class ProjectIndex(RealTimeSearchIndex):
    text = CharField(document=True, use_template=True)
    pub_date = DateTimeField(model_attr='start_date')

    def index_queryset(self):
        return Project.objects.filter(site=settings.SITE_ID)

site.register(Project, ProjectIndex)
