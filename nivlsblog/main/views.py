from nivlsblog.main.models              import ContactForm
from django.shortcuts                   import render_to_response
from django.core.context_processors     import csrf
from django.core.mail                   import send_mail
from django.conf                        import settings


def index(request):
    return render_to_response('main/index.html')


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
    else:
        form = ContactForm()
    c = {'form': form}
    c.update(csrf(request))
    if form.is_valid():
        msg = form.cleaned_data['message'] + "\n\n\n" + ('-' * 80)
        msg += "\n\n Ip : " + request.META["REMOTE_ADDR"]
        subject = "[Nivl's blog] " + form.cleaned_data['subject']
        send_mail(subject,
                  msg,
                  form.cleaned_data['email'],
                  [settings.ADMINS[0][1]])
        c = {'verb': 'sent', 'link': '/'}
        return render_to_response('generic/flash/message_added.html', c)
    else:
        return render_to_response('main/contact.html', c)
