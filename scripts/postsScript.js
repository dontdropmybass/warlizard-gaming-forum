var serverroot = "http://ec2-54-91-162-178.compute-1.amazonaws.com:3000";
var localroot = "http://localhost:3000";
var myroot = serverroot;
var id;
var imgur_re = new RegExp ("([^\s]+(\.(jpg|png|gif|gifv|webm|bmp|JPG|PNG|GIF|GIFV|WEBM|BMP))$)");
var static_img = new RegExp ("([^\s]+(\.(jpg|png|gif|bmp|JPG|PNG|GIF|BMP))$)");
var gifv_img = new RegExp ("([^\s]+(\.(gifv|GIFV))$)");
var webm_img = new RegExp ("([^\s]+(\.(webm|WEBM))$)");
var currentPost;
var loc;
//we will also need a function to re-display the original post 
//that all these comments are about

function getQueryVariable(variable) {
    //debugger;
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            getPost(pair[1]);
            return pair[1];
        }
    } 

  console.log('Query Variable ' + variable + ' not found');
}

function edit() {
    $("#edit-modal").modal('open');
    $("#edit-title").val(currentPost.title);
    $("#edit-link").val(currentPost.imgLink);
    $("#edit-body").val(currentPost.body);
}

function remove(id) {
    //should delete the post then send user back to index.html
 $.ajax({
        url: myroot + '/posts/' + id,
        type: 'DELETE',
    error: function (request, status, error) {
        alert(request.responseText);
    },
    success:function(){
        location.href = 'index.html';
    }

    });
}

function save(id) {
    var url = $("#edit-link").val();
    var res = true;
    //nevermind this dosen't work
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
                url: myroot + '/posts/' + id,
                type: 'PATCH',
                data: {
                    title: $("#edit-title").val(),
                    body: $("#edit-body").val(),
                    imgLink: url
                },
                dataType: 'json'
            }))
            .done(function(data){
                location.reload(true); 
            })
            .fail(function (error) {
                console.log(error);
            });
        $("#edit-modal").modal("close");
    }
    else {
        //user entered improper URL so give them a message
        alert("Improper image URL");
    }

}

//get the post and display the image in the appropriate html
function getPost(postID) {
    $.ajax({
        url: myroot + "/posts/" + postID,
        method: 'GET',
        success:function(data) {
            currentPost = data;
            $.when($.ajax({
                url: "http://ec2-54-91-162-178.compute-1.amazonaws.com:8080/json/"
            }))
                .done(function(l) {
                    loc = l;
                    $("#posts").html("");
                    if (static_img.test(data.imgLink)) {
                        $("#posts").append( "<div id='post" + postID + "' class='card'>" +
                            "<div id='post" + postID + "title' class='card-title' >" +
                            "<h3>" + data.title + getCountryFlag(data.country_code) + "</h3>" + "</div>" +
                            "<img src='" + data.imgLink + "' class='responsive-img'/>"+
                            "<div id='post" + postID + "body' class='card-body'>" +
                            "<p>" + data.body + "</p>"
                        );
                    }
                    else if (gifv_img.test(data.imgLink)) {
                        var imgthing = data.imgLink.replace(/(.gifv|.GIFV)$/, ".mp4");
                        $("#posts").append( "<div id='post" + postID + "' class='card'>" +
                            "<div id='post" + postID + "title' class='card-title' >" +
                            "<h3>" + data.title + getCountryFlag(data.country_code) + "</h3>" + "</div>" +
                            "<video class='responsive-video' preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline>" +
                            "<source src='" + imgthing + "' type='video/mp4'/>" +
                            "</video>" +
                            "<div id='post" + postID + "body' class='card-body'>" +
                            "<p>" + data.body + "</p>"
                        );
                    }
                    else if (webm_img.test(data.imgLink)) {
                        $("#posts").append( "<div id='post" + postID + "' class='card'>" +
                            "<div id='post" + postID + "title' class='card-title' >" +
                            "<h3>" + data.title + getCountryFlag(data.country_code) + "</h3>" + "</div>" +
                            "<video class='responsive-video' preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline>" +
                            "<source src='" + data.imgLink + "' type='video/webm'/>" +
                            "</video>" +
                            "<div id='post" + postID + "body' class='card-body'>" +
                            "<p>" + data.body + "</p>"
                        );
                    }
                    else {
                        $("#posts").append( "<div id='post" + postID + "' class='card'>" +
                            "<div id='post" + postID + "title' class='card-title' >" +
                            "<h3>" + data.title + getCountryFlag(data.country_code) + "</h3>" + "</div>" +
                            "<div id='post" + postID + "body' class='card-body'>" +
                            "<p>" + data.body + "</p>"
                        );
                    }
                    if (l.ip == data.ip) {
                        $("#posts").append(
                            "<a onclick='edit()' class='btn-floating halfway-fab waves-effect waves-light orange'>" +
                            "<i class='material-icons'>edit</i></a>"
                        );
                    }
                    $("#posts").append( "</div></div>");
                })
                .fail(function(error) {
                    console.log(error);
                });
        },
        error: function (e) {
            console.log(e);
        }
    });

}

// gets all the comments for a specified post
function getComments(id) {
    $("#comments").html("");
    $.ajax({
        url: myroot + "/comments?postId=" + id,
        method: 'GET',
        success: function(data) {
            console.log(data);
            for(var i=0, len = data.length; i < len; i++){
                //debugger;
                if(data[i].postId == id){
                $("#comments").append( "<div id='comment" + i + "'style='padding:10px;' class='card'>" +
                    "<div id='comment" + i + "body' class='card-body'>" +
                    "<i>" + getCountryFlag(data[i].country_code) + "</i>" +
                    "<p>" + data[i].body + "</p>" +
                    "</div></div>");
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

}

function makeComment(){
    //console.log($("#add-comment").val());
    comment = $("#add-comment").val();
    if(comment == "" || comment == null || comment == " "){
        alert("Enter a value for comment.");
    }else{
        $.ajax({
            url: myroot + '/comments',
            type: 'POST',
            data: {
                body: $("#add-comment").val(),
                imgLink: "",
                postId: id,
                ip: loc.ip,
                country_code: loc.country_code
            },
            dataType: 'json'
        })
        .done(function(data){
            console.log("success")
            getComments(id);
        })
        .fail(function (error) {
            console.log(request.responseText);
        });
    }
}


$( function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    id = getQueryVariable("id");
    getPost(id);
    getComments(id);
    $("#edit-save").click(function(){save(id)});
    $("#edit-delete").click(function(){remove(id)});
});
