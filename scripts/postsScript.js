
//we will also need a function to re-display the original post 
//that all these comments are about



//theoretically this gets all the comments for a specified post
//need to pass the value of the post though
function getComments(postID) {

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