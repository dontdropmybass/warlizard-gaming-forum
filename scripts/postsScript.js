var serverroot = "http://ec2-54-91-162-178.compute-1.amazonaws.com:3000";
var localroot = "http://localhost:3000";
var myroot = localroot;
var id;
var imgur_re = new RegExp ("([^\s]+(\.(jpg|png|gif|gifv|webm|bmp|JPG|PNG|GIF|GIFV|WEBM|BMP))$)");
var static_img = new RegExp ("([^\s]+(\.(jpg|png|gif|bmp|JPG|PNG|GIF|BMP))$)");
var gifv_img = new RegExp ("([^\s]+(\.(gifv|GIFV))$)");
var webm_img = new RegExp ("([^\s]+(\.(webm|WEBM))$)");
var currentPost;
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

function remove() {

}

function save() {

}

function getPost(postID) {
    $.ajax({
        url: myroot + "/posts/" + postID,
        method: 'GET',
        success:function(data) {
            currentPost = data;
            $.when($.ajax({
                url: "http://ec2-54-91-162-178.compute-1.amazonaws.com:8080/json/"
            }))
                .done(function(location) {
                    $("#posts").html("");
                    if (static_img.test(data.imgLink)) {
                        $("#posts").append( "<div id='post" + postID + "' class='card'>" +
                            "<div id='post" + postID + "title' class='card-title' >" +
                            "<h3>" + data.title + getCountryFlag(data.country_code) + "</h3>" + "</div>" +
                            "<img src='" + data.imgLink + "' class='materialboxed'/>"+
                            "<div id='post" + postID + "body' class='card-body'>" +
                            "<p>" + data.body + "</p>"
                        );
                    }
                    else if (gifv_img.test(data.imgLink)) {
                        var imgthing = data.imgLink.replace(/(.gifv|.GIFV)$/, ".mp4");
                        $("#posts").append( "<div id='post" + postID + "' class='card'>" +
                            "<div id='post" + postID + "title' class='card-title' >" +
                            "<h3>" + data.title + getCountryFlag(data.country_code) + "</h3>" + "</div>" +
                            "<video preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline>" +
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
                            "<video preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline>" +
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
                    if (location.ip == data.ip) {
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

//theoretically this gets all the comments for a specified post
//need to pass the value of the post though
function getComments(id) {
    $("#comments").html("");
    $.ajax({
        url: myroot + "/comments?postId=" + id,
        method: 'GET',
        success: function(data) {
            console.log(data);
            for(var i=0, len = data.length; i < len; i++){
                //debugger;
                if(data[i]['postId'] == id){
                $("#comments").append( "<div id='comment" + i + "'style='padding:10px;' class='card'>" +
                                    (data[i].imgLink!=undefined&&data[i].imgLink!=""?
                                        "<img src='"+data[i].imgLink+"' class='materialboxed'/>":
                                        "")+
                                    "<div id='comment" + i + "body' class='card-body'>" +
                                    "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                                    "</div>");
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
                postId: id
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
    $("#edit-save").click(function(){save()});
    $("#edit-delete").click(function(){remove()});
});
