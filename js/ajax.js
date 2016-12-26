var URL;
var mode;
var _GET = [];
_GETURL();
var pageno = 0
var pagemax = 0
var pageContent = ""
var contentno = { "food": 0, "travel": 0 }
var contentmax = { "food": 0, "travel": 0 }
var contentsize = 0
var types
var swipestart;
var dataSource = {
    "food": "https://raw.githubusercontent.com/fcu-d0562215/wp-project/master/food.json",
    "travel": "https://raw.githubusercontent.com/fcu-d0562215/wp-project/master/travel.json"
}
var content = {
    "food": "",
    "travel": ""
}
window.onpopstate = function() {
    if (event.state) {
        console.log(event)
        $('.container-fluid').html(event.state.response);
        scrolltop();
    }
}

function initMap(lati, long) {
    var uluru = {
        lat: lati,
        lng: long
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

function _resetDataLayout() {
    $("#body").remove();
    $(".container-fluid").append('<div id="body"><div id="DataBody"><div class="row"><img id="cover" src="" width="100%" height="100%"></div><div class="row" style="padding-top:20px;padding-bottom:20px; "><span id="title" style="border-bottom:3px solid;"></span></div><div class="row"><h2 id="paragraph" ></h2></div><div class="row"><div id="_content" style="margin-bottom:15px" ></div></div></div></div>')
}

function _resetMainLayout() {
    $("#body").remove();
    $(".container-fluid").append('<div class="row" id="body"><div class="col-xs-12"><div id="frame" class="col-xs-12"><p>ROAD TO FUTURE</p></div></div><div class="calouse col-xs-12"><a id="calouse_Header" href="">Food</a><div class="col-xs-12" style="padding:0"><div id="foodContent" class="calouse_Content"  ><div id="food" class="col-xs-12" ontouchstart="mainSwipeStart(food)" ontouchend="mainSwipeEnd(food)"></div><span id="nextfood" onclick="nextContent(food)">></span></div></div></div><div class="calouse col-xs-12"><a id="calouse_Header" href="">Travel</a><div id="travelContent" class="calouse_Content col-xs-12" ><div id="travel" class="col-xs-12" ontouchstart="mainSwipeStart(travel)" ontouchend="mainSwipeEnd(travel)" ></div><span id="nexttravel" onclick="nextContent(travel)">></span></div></div></div>')
}

function _processData(data) {
    _resetDataLayout();
    $("#title").text(data.title);
    $("#paragraph").text(data.paragraph);
    $("#cover").attr('src', data.cover).height(_height() * 0.45);
    var _content = document.querySelector("#body #DataBody #_content")
    if (data.content) {
        var _dataDetails = "",
            _dataContent = "";
        for (var i = 0; i < Object.keys(data.content).length; i++) {
            if (data.content[i].picture) {
                _dataContent += "<img src=" + data.content[i].picture + " style='margin-bottom:20px' width='70%' ><br>"
            }
            // console.log(document.querySelector("#body"))
            if (data.content[i].text) {
                _dataContent += "<p>" + data.content[i].text + "</p><br>"
            }
        }
        _content.innerHTML += '<div style="padding:10px 12% 0 12%">' + _dataContent + "</div>";
    }
    _content = $("#body>#DataBody>div:nth-of-type(4)>div:first")
    if (data.details) {
        for (var i = 0; i < Object.keys(data.details).length; i++) {
            _dataDetails += Object.keys(data.details)[i] + " : " + data.details[Object.keys(data.details)[i]] + "<br>"
        }
        _content.before("<div class='col-md-4 col-lg-3 text-xs-left push-md-8 push-lg-9' style='margin-bottom:15px;'><div id='details' style='padding:10px 5px;'><span>" + _dataDetails + "</span></div></div>");
    }
    _content = document.querySelector("#body>#DataBody>div:nth-of-type(4)")
    if (data.lat) {
        _content.innerHTML += "<div class='col-md-4 col-lg-3 push-md-8 push-lg-9'><div style='padding: 0px 10px;'><p>地圖</p><p id='map' ></p></div></div>";
        $("#body #_content").addClass("col-md-8 col-lg-9 float-md-right pull-md-4 pull-lg-3")
        initMap(data.lat, data.long)
    }
    return _resize();
}

function _getData(type, page) {
    if (page === undefined)
        page = 0;
    $.ajax({
        method: 'Get',
        url: "https://raw.githubusercontent.com/fcu-d0562215/wp-project/master/" + type + ".json",
        dataType: "json",
        success: function(response) {
            pageContent = response
            pagemax = Object.keys(response).length - 1
            types = type
            if (_processData(response[Object.keys(response)[page]])) {
                scrolltop();
                $.each(response, function(i, v) {
                    // console.log("v ="+v)
                    // console.log("i = "+i)
                    for (i in v) {
                        // console.log(i)
                        if (String(v[i]).search(new RegExp(/拉麵/i)) != -1) {
                            // console.log(v[i])
                        }
                    }
                });
                console.log()
                if (history.state && history.state.url != "?" + type + "&page=" + page) {
                    history.pushState({ response: $('.container-fluid').html(), type: type, page: page, url: "?" + type + "&page=" + page }, response[Object.keys(response)[page]].title, "?" + type + "&page=" + page);
                } else {
                    history.replaceState({ response: $(".container-fluid").html(), type: type, page: page, url: "?" + mode + "&page=" + _GET["page"] }, "首頁", "?" + mode + "&page=" + _GET["page"]);
                }
            }
        }
    })
}

function mainSwipeStart() {
    e = this.event
    swipestart = e.touches[0].clientX
}

function mainSwipeEnd(type) {
    e = this.event
    if (swipestart - e.changedTouches[0].clientX >= 50 || swipestart - e.changedTouches[0].clientX <= -50) {
        if (swipestart > e.changedTouches[0].clientX) {
            nextContent(type)
        } else {
            prevContent(type)
        }
    }
}

function nextpage() {
    if (pageno != pagemax) {
        pageno += 1
        _processData(pageContent[Object.keys(pageContent)[pageno]])
        if (pageno < pagemax) {
            if (!$("#nextpagebutton").html()) {
                $("#DataBody").append("<span id='nextpagebutton' onclick='nextpage()''></span>")
            }
        } else {
            $("#nextpagebutton").remove()
        }
        if (pageno > 0 && !$("#prevpagebutton").html()) {
            $("#DataBody").prepend("<span id='prevpagebutton' onclick='previouspage()''></span>")
        }
    }
}

function previouspage() {
    if (pageno != 0) {
        pageno -= 1
        _processData(pageContent[Object.keys(pageContent)[pageno]])
        if (pageno > 0) {
            if (!$("#prevpagebutton").html()) {
                $("#DataBody").prepend("<span id='prevpagebutton' onclick='previouspage()''></span>")
            }
        } else {
            $("#prevpagebutton").remove()
        }
        if (pageno < pagemax && !$("#nextpagebutton").html()) {
            $("#DataBody").append("<span id='nextpagebutton' onclick='nextpage()''></span>")
        }
    }
}

function nextContent(type) {
    if (contentno[type.id] != contentmax[type.id] && contentno[type.id] <= contentmax[type.id] - contentsize) {
        contentno[type.id] += contentsize
        if (contentno[type.id] > contentmax[type.id] - contentsize) {
            $('#next' + type.id).remove()
        }
        _processMain(content[type.id], type.id, contentno[type.id])
        if (contentno[type.id] != 0) {
            if (!$("#prev" + type.id).html()) {
                $("#" + type.id + "Content").prepend('<span id="prev' + type.id + '" onclick="prevContent(' + type.id + ')"><</span>')
            }
        }
    }
}

function prevContent(type) {
    if (contentno[type.id] != 0) {
        contentno[type.id] -= contentsize
        if (contentno[type.id] < 0) {
            contentno[type.id] = 0
        }
        _processMain(content[type.id], type.id, contentno[type.id])
        if (contentno[type.id] <= 0) {
            $('#prev' + type.id).remove()
        }
        if (contentno[type.id] != contentmax[type.id] - contentsize) {
            if (!$("#next" + type.id).html()) {
                $('#' + type.id + 'Content').append("<span id='next" + type.id + "' onclick='nextContent(" + type.id + ")'>></span>")
            }
        }
    }
}

function mainpage() {
    _resetMainLayout();
    _changeContentSize();
    for (type in dataSource) {
        _getMainData(dataSource[type], type, contentno[type])
    }
    if (history.state && history.state.url != "?main") {
        history.pushState({ response: $(".container-fluid").html(), url: "?main" }, "首頁", "?main")
    } else {
        history.replaceState({ response: $(".container-fluid").html(), url: "?main" }, "首頁", "?main")
    }
}

function _getMainData(url, type, content_no) {
    $.ajax({
        method: 'Get',
        url: url,
        dataType: "json",
        success: function(response) {
            content[type] = response
            _processMain(content[type], type, content_no);
        }
    })
}

function _processMain(data, type, content_no) {
    contentmax[type] = Object.keys(data).length - 1;
    $('#' + type).html("")
    for (i = content_no; i < content_no + contentsize; i++) {
        if (data[Object.keys(data)[i]]) {
            var source = data[Object.keys(data)[i]];
            var title = source.title;
            var cover = source.cover;
            var paragraph = source.paragraph;
            var str = "_getData('"+type+"','"+content_no+"')"
            var string = '<div style="cursor:pointer;" class="mycard col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2" onclick="'+str+'"><p style="cursor:pointer;" class="mycard_title">' + title + '</p><img style="cursor:pointer;" src="' + cover + '" alt=""><p style="cursor:pointer;" class="content">' + paragraph + '</p><a style="cursor:pointer;" class="moreInfo" href onclick="event.preventDefault();">More info ...</a></div>'
            $('#' + type).append(string);
        }
    }
}
$("#bitch").ready(function() {
    window.onkeyup = function(e) {
        if (e.keyIdentifier == "Right" || e.keyCode == 39) {
            nextpage();
        } else if (e.keyIdentifier == "Left" || e.keyCode == 37) {
            previouspage();
        }
    }
})

function hide_progressbar() {
    $("#loading").stop().animate({ opacity: 0 }, 300, function() { $("#loading").css('display', 'none'); });
    return $(".progress").stop().delay(300).animate({ opacity: 0 }, 300, function() { $(".progress").css('display', 'none').attr('value', 0); });
}

function _resize() {
    _changeContentSize();
    return true;
}

function _changeContentSize() {
    var n = _width();
    n < 576 ? contentsize = 1 : n < 768 ? contentsize = 2 : n < 992 ? contentsize = 3 : n < 1200 ? contentsize = 4 : contentsize = 5
}

function scrolltop() {
    $(document).scrollTop(0)
}

function _width() {
    return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName("body")[0].clientWidth
}

function _height() {
    return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName("body")[0].clientHeight
}
$(window).resize(function() {
    _resize()
    for (type in dataSource) {
        _processMain(content[type], type, contentno[type])
        if (contentno[type] + contentsize > contentmax[type]) {
            $('#next' + type).remove()
        } else {
            if (!$("#next" + type).html()) {
                $('#' + type + 'Content').append("<span id='next" + type + "' onclick='nextContent(" + type + ")'>></span>")
            }
        }
        if (contentno[type] <= 0) {
            $('#prev' + type).remove()
        } else {
            if (!$("#prev" + type).html()) {
                $('#' + type + 'Content').append("<span id='prev" + type + "' onclick='prevContent(" + type + ")'><</span>")
            }
        }
    }
});
$(document).ready(function() {
    $("ul.nav li.dropdown").hover(function() {
        $(this).find(".dropdown-menu").stop(!0, !0).delay(50).fadeIn(100), $(this).find("a").attr("aria-expanded", "true"), $(this).addClass("open")
    }, function() {
        $(this).find(".dropdown-menu").stop(!0, !0).delay(50).fadeOut(100), $(this).find("a").attr("aria-expanded", "false"), $(this).removeClass("open")
    });
    if (mode == "food" || mode == "travel") {
        _getData(mode, _GET["page"]);
    } else {
        _resetMainLayout();
        mainpage();
        
    }
});
$.ajaxSetup({
    method: "POST",
    cache: false,
    processData: false,
    contentType: false,
    beforeSend: function(xhr) {
        $("#loading").stop().css('display', 'block').animate({ opacity: 1 }, 1000);
        $(".progress").stop().css({
            opacity: '1',
            display: 'block'
        });
    },
    xhr: function() {
        var xhr = new window.XMLHttpRequest();
        var percentComplete = 0;
        //Upload progress
        xhr.upload.addEventListener("progress", function(evt) {
            // console.log("QaQ")
            if (evt.lengthComputable) {
                percentComplete = (evt.loaded / evt.total) * 20;
                //Do something with upload progress
                console.log("  up " + percentComplete);
                $(".progress").attr('value', percentComplete);
            }
        }, false);
        //Download progress
        xhr.addEventListener("progress", function(evt) {
            // console.log(evt.loaded)
            if (evt.lengthComputable) {
                // console.log("QoQq")
                percentComplete = ((evt.loaded / evt.total) * 80) + 20;
                //Do something with download progress
                // console.log("down "+percentComplete);
                $(".progress").attr('value', percentComplete)
            }
        }, false);
        return xhr;
    }
});
$(document).ajaxStop(function() {
    hide_progressbar();
});

function _GETURL() {
    URL = window.location.href.split("?");
    URL.shift()
    if (URL.length > 0 && URL[URL.length - 1] != "") {
        URL = URL.shift().split("&");
        mode = URL.shift();
        URL.forEach(function(get) {
            var tmp = get.split("=");
            _GET[tmp[0]] = tmp[1];
        })
    }
}
