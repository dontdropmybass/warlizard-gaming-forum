var PostID;
//we will also need a function to re-display the original post 
//that all these comments are about
function getPost(postID) {
    //set global variable that way we dont have to 
    //send the same value into more functions
    PostID = postID;
    $.ajax({
        url: root + "/posts/" + postID,
        method: 'GET',
        success:function(data) {
            console.log(data);
            posts = data;
            $("#posts").html("");
            for(i=0; i < data.length; i++){
                console.log(data[i]);
                //console.log(data[i]['title']);
                //console.log(data[i]['body']);
                $("#posts").append( "<div id='post' class='card'>" +
                                    "<div id='postTitle' class='card-title' >" +
                                    "<h3>" + data[i]['title'] + "</h3>" + "</div>" +
                                    (data[i].imgLink!=undefined&&data[i].imgLink!=""?
                                        "<img src='"+data[i].imgLink+"' class='materialboxed'/>":
                                        "")+
                                    "<div id='postBody' class='card-body'>" +
                                    "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                                    "</div>");
            }

        },
        error: function (e) {
            console.log(e);
        }
    });

}

//theoretically this gets all the comments for a specified post
//need to pass the value of the post though
function getComments() {

    $.ajax({
        url: root + "/posts/" + postID + "?_embed=comments",
        method: 'GET',
        success:function(data) {
            console.log(data);
            posts = data;
            $("#comments").html("");
            for(i=0; i < data.length; i++){
                console.log(data[i]);
                //console.log(data[i]['title']);
                //console.log(data[i]['body']);
                $("#comments").append( "<div id='comment" + i + "' class='card'>" +
                                    (data[i].imgLink!=undefined&&data[i].imgLink!=""?
                                        "<img src='"+data[i].imgLink+"' class='materialboxed'/>":
                                        "")+
                                    "<div id='comment" + i + "body' class='card-body'>" +
                                    "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                                    "</div>");
            }

        },
        error: function (e) {
            console.log(e);
        }
    });

}

$( function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    getPost();
    getComments();
});