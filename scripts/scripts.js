var serverroot = "http://ec2-54-91-162-178.compute-1.amazonaws.com:3000";
var localroot = "http://localhost:3000";
var myroot = serverroot;
//regexes added for different file types
var imgur_re = new RegExp ("([^\s]+(\.(jpg|jpeg|png|gif|gifv|webm|bmp|JPG|JPEG|PNG|GIF|GIFV|WEBM|BMP))$)");
var static_img = new RegExp ("([^\s]+(\.(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP))$)");
var gifv_img = new RegExp ("([^\s]+(\.(gifv|GIFV))$)");
var webm_img = new RegExp ("([^\s]+(\.(webm|WEBM))$)");
var posts;
var loc;
var query = "";

//get Users IP address
//used for editing/deleting posts
function getUserLocation() {
    $.when($.ajax({
        url: "http://ec2-54-91-162-178.compute-1.amazonaws.com:8080/json/"
    }))
        .done(function(data) {
            loc = data;
        })
        .fail(function(error) {
            console.log(error);
        })
}

//get the post and display the image in the appropriate html
function getPosts() {
    $.when(
        $.ajax({
            url: myroot + "/posts?q=" + query + "&_sort=date&_embed=comments"
        }))
        .done(function(data) {
            debugger;
            console.log(data);
            posts = data;
            $("#posts").html("");
            for(i=0; i < data.length; i++){
                console.log(data[i]);
                //console.log(data[i]['title']);
                //console.log(data[i]['body']);
                /*
                This thing below changes the link holder depending on the file extension on the end
                 */
                if (static_img.test(data[i].imgLink)) {
                    $("#posts").append( "<div id='post" + i + "' class='card'>" +
                        "<div id='post" + i + "title' class='card-title' >" +
                        "<h3>" + data[i]['title'] + getCountryFlag(data[i].country_code) + "</h3>" + "</div>" +
                        "<img src='" + data[i].imgLink + "' class='materialboxed'/>"+
                        "<div id='post" + i + "body' class='card-body'>" +
                        "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                        "<div id=footer class=card-footer><a class='btn' href='post.html?id="+data[i].id+"'>View Comments (" + data[i].comments.length + ")</a></div></div>");
                }
                else if (gifv_img.test(data[i].imgLink)) {
                    var imgthing = data[i].imgLink.replace(/(.gifv|.GIFV)$/, ".mp4");
                    $("#posts").append( "<div id='post" + i + "' class='card'>" +
                        "<div id='post" + i + "title' class='card-title' >" +
                        "<h3>" + data[i]['title'] + getCountryFlag(data[i].country_code) + "</h3>" + "</div>" +
                        "<video preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline>" +
                        "<source src='" + imgthing + "' type='video/mp4'/>" +
                        "</video>" +
                        "<div id='post" + i + "body' class='card-body'>" +
                        "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                        "<div id=footer class=card-footer><a class='btn' href='post.html?id="+data[i].id+"'>View Comments (" + data[i].comments.length + ")</a></div></div>");
                }
                else if (webm_img.test(data[i].imgLink)) {
                    $("#posts").append( "<div id='post" + i + "' class='card'>" +
                        "<div id='post" + i + "title' class='card-title' >" +
                        "<h3>" + data[i]['title'] + getCountryFlag(data[i].country_code) + "</h3>" + "</div>" +
                        "<video preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline>" +
                        "<source src='" + data[i].imgLink + "' type='video/webm'/>" +
                        "</video>" +
                        "<div id='post" + i + "body' class='card-body'>" +
                        "<p>" + data[i]['body'] + "</p>" + "</div>" +
                        "<div id=footer class=card-footer><a class='btn' href='post.html?id="+data[i].id+"'>View Comment (" + data[i].comments.length + ")</a></div></div>");
                }
                else {
                    $("#posts").append( "<div id='post" + i + "' class='card'>" +
                        "<div id='post" + i + "title' class='card-title' >" +
                        "<h3>" + data[i]['title'] + getCountryFlag(data[i].country_code) + "</h3>" + "</div>" +
                        "<div id='post" + i + "body' class='card-body'>" +
                        "<p>" + data[i]['body'] + "</p>" + "</div>" +
                        "<div id=footer class=card-footer><a class='btn' href='post.html?id="+data[i].id+"'>View Comment (" + data[i].comments.length + ")</a></div></div>");
                }
            }
        })
        .fail(function(e) {
            debugger;
            console.log(e);
        });
}

function makePost(){
    var url = $("#add-img").val();
    var res = true;
    if (url != "" && url != "") {
        res = imgur_re.test(url);
    }
    else {
        //if they didn't enter a link then it's chill
        //no need to validate
        res = true;
    }
    if(res){
        $.when(
            $.ajax({
                url: myroot + '/posts',
                type: 'POST',
                data: {
                    title: $("#add-title").val(),
                    body: $("#add-body").val(),
                    ip: loc.ip,
                    country_code: loc.country_code,
                    imgLink: url
                },
                dataType: 'json'
            }))
            .done(function(data){
                getPosts();
            })
            .fail(function (error) {
                console.log(error);
            });
        $("#add").modal("close");
    }
    else {
        //user entered improper URL so give them a message or something
        alert("Improper image URL");
    }
}

function checkPageUnload(e) {

}

$( function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    getUserLocation();
    $("#searchbox").on('input', function() {
        query = $("#searchbox").val();
        getPosts();
    });
    getPosts();
});

