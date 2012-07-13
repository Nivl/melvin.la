/******************************************************************************
 * Contact
 *****************************************************************************/

var resolve_urls = django_js_utils.urls.resolve;

new Ajaxion(resolve_urls('contact-form'),
	    {'selector': '#contact-form',
	     'events': 'submit'},
            'POST',
            [
		{
                    'url': 'current_url',
                    'visible': true,
                    'selectors' : [
			{
                            'current': '#contact-form',
                            'target': '*',
                            'insert': false
			}
                    ],
		}
	    ],
            {
		'success': [
                    {'callback': Ajaxion.cb_push_before}
		],
		'error': [Ajaxion.cb_error_push_before],

            }
	   ).start();





var commentFormAjax = new Ajaxion('',
				  {'selector': '#comment-form',
				   'events': 'submit'},
				  'POST',
				  [
				      {
					  'url': 'current_url',
					  'visible': true,
					  'selectors' : [
					      {
						  'current': '#comment-form',
						  'target': '*',
						  'insert': false
					      }
					  ],
				      },

				      {
					  'url': '',
					  'visible': false,
					  'disabled': true,
					  'callbacks': [
					      addNewComment
					  ],
					  'selectors' : [
					      {
						  'current': '#comment-list',
						  'target': '*',
						  'insert': true
					      }
					  ],
				      },
				      {
					  'url': '',
					  'visible': false,
					  'disabled': true,
					  'selectors' : [
					      {
						  'current': '#comments-count',
						  'target': '*',
						  'insert': true
					      }
					  ],
				      },
				  ],
				  {
				      'success': [
					  {'callback': Ajaxion.cb_push_before},
					  {'callback': clearPreview,
					   'force': true}
				      ],
				      'error': [Ajaxion.cb_error_push_before]
				  }
				 );
// Callbacks

function clearPreview() {
    $('#form-preview').empty();
};

function addNewComment() {
    $('#comment-list .comment:last-child').animateHighlight();
}

/******************************************************************************
 * Users
 *****************************************************************************/

var confirmPasswordAjax = new Ajaxion('',
				      {'selector': '#confirm-password-form',
				       'events': 'submit'},
				      'POST',
				      [
					  {
					      'url': 'current_url',
					      'visible': true,
					      'selectors' : [
						  {
						      'current': '#confirm-password-form',
						      'target': '*',
						      'insert': false
						  }
					      ],
					  },
				      ],
				      {
					  'success': [
					      {'callback': Ajaxion.cb_replace}
					  ],
					  'error': [Ajaxion.cb_error_push_before],
				      }
				     ).start();


new Ajaxion(resolve_urls('reset-password-form'),
	    {'selector': '#reset-password-form',
	     'events': 'submit'},
	    'POST',
	    [
		{
		    'url': 'current_url',
		    'visible': true,
		    'selectors' : [
			{
			    'current': '#reset-password-form',
			    'target': '*',
			    'insert': false
			}
		    ],
		},
	    ],
	    {
		'success': [
		    {'callback': Ajaxion.cb_push_before}
		],
		'error': [Ajaxion.cb_error_push_before],
	    }
	   ).start();


var editProfileAjax = new Ajaxion(resolve_urls('edit-account-form'),
				  {'selector': '#edit-account-form',
				   'events': 'submit'},
				  'POST',
				  [
				      {
					  'url': resolve_urls('get-common-header'),
					  'visible': true,
					  'selectors' : [
					      {
						  'current': '#header-menu-user',
						  'target': '#header-menu-user',
						  'insert': false
					      }
					  ],
				      }
				  ],
				  {
				      'success': [
					  {'callback': hideOnSuccess}
				      ],

				      'error': [
					  colorOnError
				      ],
				  }
				 );

editProfileAjax.fileUpload = true;
editProfileAjax.start();

new Ajaxion(resolve_urls('edit-account-form'),
	    {'selector': '#modal-edit-profile',
	     'events': 'shown'},
	    'GET',
	    [
		{
		    'url': 'current_url',
		    'visible': true,
		    'callbacks': [clearError],
		    'selectors' : [
			{
			    'current': '#edit-account-form',
			    'target': '*',
			    'insert': false
			}
		    ],
		},
	    ]
	   ).start();


new Ajaxion(resolve_urls('edit-settings-form'),
	    {'selector': '#edit-settings-form',
	     'events': 'submit'},
	    'POST',
	    [],
	    {
		'success': [
		    {'callback': hideOnSuccess}
		],

		'error': [
		    colorOnError
		],
	    }
	   ).start();

new Ajaxion(resolve_urls('edit-settings-form'),
	    {'selector': '#modal-edit-settings',
	     'events': 'shown'},
	    'GET',
	    [
		{
		    'url': 'current_url',
		    'visible': true,
		    'callbacks': [clearError],
		    'selectors' : [
			{
			    'current': '#edit-settings-form',
			    'target': '*',
			    'insert': false
			}
		    ],
		},
	    ]
	   ).start();


new Ajaxion(resolve_urls('edit-password-form'),
	    {'selector': '#edit-password-form',
	     'events': 'submit'},
	    'POST',
	    [
		{
		    'url': resolve_urls('get-common-header'),
		    'visible': true,
		    'selectors' : [
			{
			    'current': '#header-menu-user',
			    'target': '#header-menu-user',
			    'insert': false
			}
		    ],
		},
		{
		    'url': resolve_urls('edit-email-form'),
		    'visible': true,
		    'selectors' : [
			{
			    'current': '#edit-email-form',
			    'target': '*',
			    'insert': false
			}
		    ],
		}
	    ],
	    {
		'success': [
		    {'callback': hideOnSuccess},
		    {'callback': function (a, b, that) {
			$('a[href="#' + $(that.bind['selector'])
			  .parents('.modal').prop('id')  + '"]')
			    .removeClass('important');
		    }}
		],
		'error': [colorOnError]
	    }
	   ).start();


new Ajaxion(resolve_urls('edit-password-form'),
	    {'selector': '#modal-edit-password',
	     'events': 'shown'},
	    'GET',
	    [
		{
		    'url': 'current_url',
		    'visible': true,
		    'callbacks': [clearError],
		    'selectors' : [
			{
			    'current': '#edit-password-form',
			    'target': '*',
			    'insert': false
			}
		    ],
		},
	    ]
	   ).start();


new Ajaxion(resolve_urls('edit-email-form'),
	    {'selector': '#edit-email-form',
	     'events': 'submit'},
	    'POST',
	    [],
	    {
		'success': [
		    {'callback': hideOnSuccess}
		],

		'error': [colorOnError]
	    }
	   ).start();


new Ajaxion(resolve_urls('edit-email-form'),
	    {'selector': '#modal-edit-email',
	     'events': 'shown'},
	    'GET',
	    [
		{
		    'url': 'current_url',
		    'visible': true,
		    'callbacks': [clearError],
		    'selectors' : [
			{
			    'current': '#edit-email-form',
			    'target': '*',
			    'insert': false
			}
		    ],
		},
	    ]
	   ).start();


new Ajaxion(resolve_urls('edit-avatar-form'),
	    {'selector': '#edit-avatar-form',
	     'events': 'submit'},
	    'POST',
	    [
		{
		    'url': 'current_url',
		    'visible': true,
		    'selectors' : [
                        {
                            'current': '#edit-avatar-form',
                            'target': '*',
                            'insert': false
                        }
                    ],
                }
	    ],
	    {
                'success': [
                    {'callback': Ajaxion.cb_push_before}
                ],
		'error': [Ajaxion.cb_error_push_before],
	    }
           ).start();


new Ajaxion(resolve_urls('sign-up-form'),
                       {'selector': '#sign-up-form',
			'events': 'submit'},
                       'POST',
                       [
			   {
                               'url': 'current_url',
                               'visible': true,
                               'selectors' : [
                                   {
                                       'current': '#sign-up-form',
                                       'target': '*',
                                       'insert': false
                                   }
                               ],
                           }
	               ],
                       {
                           'success': [
                               {'callback': Ajaxion.cb_replace}
                           ],
			   'error': [Ajaxion.cb_error_push_before],
                       }
                      ).start();

// Callbacks
$(document).on('hidden', '[id^=modal-edit-]', function() {
    var target = $(this).find('[id^=edit-][id$=-form]');
    target.replaceWith('<div id="' + target.prop('id') + '"><img src="../../img/ajax-loader.gif" alt="loading"></div>');
});


// HELPERS

function hideOnSuccess(html, textStatus, that) {
    $(that.bind['selector']).parents('.modal').modal('hide');
}

function clearError(data, that) {
    $(that.bind['selector']).css('background-color', '#fff');
}

function colorOnError(XMLHttpRequest, textStatus, errorThrown, that) {
    $(that.bind['selector']).parents('.modal').css('background-color', '#f2dede');
}
