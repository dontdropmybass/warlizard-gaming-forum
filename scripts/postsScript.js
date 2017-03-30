var serverroot = "http://ec2-54-91-162-178.compute-1.amazonaws.com:3000";
var localroot = "http://localhost:3000";
var myroot = serverroot;
var id;
//we will also need a function to re-display the original post 
//that all these comments are about

function getQueryVariable(variable) {
    //debugger;
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            getPost(pair[1])
            return pair[1];
        }
    } 

  console.log('Query Variable ' + variable + ' not found');
}
function getPost(postID) {
    //set global variable that way we dont have to 
    //send the same value into more functions
    $.ajax({
        url: myroot + "/posts/" + postID,
        method: 'GET',
        success:function(data) {
            //console.log(data);
            posts = data;
            $("#posts").html("<br>");
            //console.log(data);
            //console.log(data[i]['title']);
            //console.log(data[i]['body']);
            $("#posts").append( "<div id='post' class='card'>" +
                                "<div id='postTitle' class='card-title' >" +
                                "<h3>" + data['title'] + "</h3>" + "</div>" +
                                (data.imgLink!=undefined&&data.imgLink!=""?
                                    "<img src='"+data.imgLink+"' class='materialboxed'/>":
                                    "")+
                                "<div id='postBody' class='card-body'>" +
                                "<p>" + data['body'] + "</p>" +  "</div>" +
                                "</div>");
        },
        error: function (e) {
            console.log(e);
        }
    });

}

//theoretically this gets all the comments for a specified post
//need to pass the value of the post though
function getComments(id) {
    $("#comments").html("")
    $.ajax({
        url: myroot + "/comments/",
        method: 'GET',
        success:function(data) {
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
    console.log($("#add-comment").val());
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


$( function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    id = getQueryVariable("id");
    //getPost(id);
    getComments(id);
});
