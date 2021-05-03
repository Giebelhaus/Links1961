$(document).ready(function() {
	$(".embed").click(function(){
		$(this).select();
	});
	ccPopup();
	checkEmbed();
});

function checkEmbed() {
	var isios = /iPhone|iPad|iPod/i.test(navigator.userAgent.toLowerCase());
	$(".mp3code").each(function() {
		$obj = $(this);
		var id = $obj.attr('id');
		id = id.replace('mp3code_', '');
		var data = {
			mp3_playlist_code: id
		};
		if( ! isios ){
		$.ajax({
			url: 'widgets_mp3_playlist_details.cfm'
			,dataType: 'json'
			,type: 'POST'
			,data: data
			,success: function(data, textStatus, XMLHttpRequest) {
				$('#mp3code_' + id).html(data.CODE);
				if (data.DISPLAY_MODE_ID == 3) {
					ccPopup();
				}
			}
			,error: function(XMLHttpRequest, textStatus, errorThrown) {
				// Message
			}
		});
		}
	});
}

function launchMP3Playlist(id) {
	var wrapper = document.getElementById('popWrapper');
	var mainbox = document.getElementById('popBox');
	if (mainbox) {
		wrapper.style.display='none';
		mainbox.style.display='none';
	}
	window.open("widgets_mp3_playlist_popup.cfm?playlist_id=" + id,"mp3_playlist","resizable=no,location=no,status=no,scrollbars=no,toolbar=no,menubar=no,width=365,height=195");
}

function launchSlideshow(id) {
	window.open("widgets_slideshow_popup.cfm?v=" + id,"slideshow","resizable=yes,location=no,status=no,scrollbars=yes,toolbar=no,menubar=no,width=666,height=620");
}

function updatePlaylistHeight(h) {
	$("#mp3_playlist").css("height", h + "px");
}

function mp3ResetCookie() {
	//alert('ccPopup()');
	$.cookie('mp3_popup_player_closed', '');
	$('.mp3code_force').hide();
}

function ccPopup() {
	if ($.cookie('mp3_popup_player_closed')) {
		if ($.cookie('mp3_popup_player_closed') == "1") {
			showInlinePopupMessage();
			return;
		}
	}
		
	var wrapper = document.getElementById('popWrapper');
	var mainbox = document.getElementById('popBox');
	if ( !mainbox ) return;
	mainbox.style.display='block';
	
	var objWidth = (Math.ceil(document.getElementById('popBox').offsetWidth/2));
	var scrWidth = (Math.ceil(document.body.scrollWidth/2));
	var newLeft = scrWidth - objWidth;

	wrapper.style.width=document.body.scrollWidth+'px';
	wrapper.style.height=document.body.scrollHeight+'px';
	wrapper.style.display='';
	mainbox.style.top = '30%';
	mainbox.style.left = newLeft+'px';
	$('.mp3code_force').hide();
	
	$.cookie('mp3_popup_player_closed', '1');
}

function mp3Popup(ret) {
	//alert('ccPopup()');
	if ($.cookie('mp3_popup_player_closed')) {
		if ($.cookie('mp3_popup_player_closed') == "1") {
			return;
		}
	}
	if (true) { // !document.form_playlist.first_time.checked) {
		// var ret = '<div id="popWrapper" style="display:none"></div><div id="popBox" style="display:none;"><div id="popMain"><div id="popHeader"><strong>Nice tracks from dev server</strong> - Class Creator</div><img src="/graphics/playlist/msgbox_icon.png" style="float:left; margin-left:10px; margin-top:10px;" /><div id="popMessage">This page contains music!<br /><br /><strong>Do you want to listen to the music?</strong></div><div id="popButtons"><input type="button" value="Listen to Music" onclick="ccPopoff(); launchMP3Playlist(\'' + playListCode + '\');" /><input type="button" value="Don\'t Listen" onclick="ccPopoff(1);" /></div></div></div>';
		$('#mp3code').append(ret);
		// alert(ret);
		var wrapper = document.getElementById('popWrapper');
		var mainbox = document.getElementById('popBox');
		if ( !mainbox ) return;
		mainbox.style.display='block';

		wrapper.style.width=document.body.scrollWidth+'px';
		wrapper.style.height=document.body.scrollHeight+'px';
		wrapper.style.display='';
		mainbox.style.top = '30%';
		mainbox.style.left = newLeft+'px';
		
		var objWidth = (Math.ceil(document.getElementById('popBox').offsetWidth/2));
		var scrWidth = (Math.ceil(document.body.scrollWidth/2));
		var newLeft = scrWidth - objWidth;
		// document.form_playlist.first_time.checked = true;
	}
}

function ccPopoff() {
	var wrapper = document.getElementById('popWrapper');
	var mainbox = document.getElementById('popBox');
	wrapper.style.display='none';
	mainbox.style.display='none';
	showInlinePopupMessage();
	$.cookie('mp3_popup_player_closed', '1');
}

function showInlinePopupMessage() {
	$('.mp3code_force').show();
}

function playlist(playListCode) {
	var ret = '<div id="popWrapper" style="display:none;"></div><div id="popBox" style="display:none;"><div id="popMain"><div id="popHeader"><strong>Nice tracks from dev server</strong> - Class Creator</div><img src="/graphics/playlist/msgbox_icon.png" style="float:left; margin-left:10px; margin-top:10px;" /><div id="popMessage">This page contains music!<br /><br /><strong>Do you want to listen to the music?</strong></div><div id="popButtons"><input type="button" value="Listen to Music" onclick="ccPopoff(); launchMP3Playlist(\'' + playListCode + '\');" /><input type="button" value="Don\'t Listen" onclick="ccPopoff(1);" /></div></div></div>';
	// document.write(ret);
	$('body').append(ret);
	ccPopup();
}

jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = "";
			options.expires = -1;
		}
/*
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
*/
		var date = new Date();
		date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days
		var expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE

        // CAUTION: Needed to parenthesize options.path and options.domain in the following expressions, otherwise they evaluate to undefined in the packed version for some reason
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
}
