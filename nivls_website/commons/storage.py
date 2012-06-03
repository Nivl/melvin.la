from django.core.files.storage import FileSystemStorage
import os
import uuid


class UniqueFileSystemStorage(FileSystemStorage):
    def get_unique_filename(self, filename):
        root, ext = os.path.splitext(filename)
        return "%s%s" % (uuid.uuid4(), ext)

    def get_valid_name(self, name):
        return self.get_unique_filename(name)

    def get_available_name(self, name):
        dirname, filename = os.path.split(name)
        file_root, file_ext = os.path.splitext(filename)
        while self.exists(name):
            name = os.path.join(dirname, self.get_unique_filename(filename))
        return name
