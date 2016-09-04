loadOlapicSDK = function(){

    var mediaList = $('.body .container .item-list'),
        streamsNavList = $('.subnav.streams > ul'),
        devkit = new OlapicDevKit();
        
    devkit.connectWithToken('459650359055b2722dbd12888d7cb74dc9793c2a71ed644d8203229d3fe1374f')
        .then(function(customer){
            var batch = new devkit.api.mediaBatch(customer, 'photorank', 50);
            batch.fetch()
                .then(function (media){
                    $.each(media, function (i, e) {
                        mediaList.append('<li class="item"><span>'+e.get('images/original')+'</span><img src="'+e.get('images/mobile')+'" /></li>');
                    });
                    $(window).scroll(function() {   
                        if($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
                            batch.next()
                            .then(function (media){
                                $.each(media, function (i, e) {                            
                                    mediaList.append('<li class="item"><span>'+e.get('images/original')+'</span><img src="'+e.get('images/mobile')+'" /></li>');
                                });              
                            });
                        }
                    });
                })
                .fail(function (error){
                    console.log('Initial media batch error: ', error);
                });    
            // need to make direct API call here - no devkit function available
            // "//z3photorankapi-a.akamaihd.net/customers/216960/streams/search"
            // then FOR EACH stream result, make following call:   
            $.ajax({
                url: 'http://rest.photorank.me/customers/216960/streams?auth_token=459650359055b2722dbd12888d7cb74dc9793c2a71ed644d8203229d3fe1374f&version=v2.2', 
                method: 'GET'
            }).success(function (result) {
                console.log(result.data._embedded.gallery);
                $.each(result.data._embedded.gallery, function(i, e) {
                    streamsNavList.append('<li class="filter">'+e.name+'</li>'); 
                });                
                $('.subnav.streams > ul > li').click(function (r) {
                    $('.item-list').html("");
                    var filter =  r.currentTarget.innerText;
                    console.log('Filter: ', filter);
                    customer.searchStream(filter)
                        .then(function (stream) {
                            var streamBatch = new devkit.api.mediaBatch(stream, 'photorank', 50);
                            streamBatch.fetch()
                                .then(function (media){
                                    $.each(media, function (i, e) {
                                        mediaList.append('<li class="item"><span>'+e.get('images/original')+'</span><img src="'+e.get('images/mobile')+'" /></li>');
                                    });
                                    $(window).scroll(function() {   
                                        if($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
                                            batch.next()
                                            .then(function (media){
                                                $.each(media, function (i, e) {                            
                                                    mediaList.append('<li class="item"><span>'+e.get('images/original')+'</span><img src="'+e.get('images/mobile')+'" /></li>');
                                                });              
                                            });
                                        }
                                    });
                                })
                                .fail(function (error){
                                    console.log('Initial media batch error: ', error);
                                });    
                        })
                        .fail(function (error) {
                            console.log('Stream search error: ', error);
                        });
                });
            });                   
            $('.subnav.sorting > ul > li').click(function (r) {         
                $('.item-list').html("");
                var filter =  r.currentTarget.innerText;
                console.log(filter);
                var sortedBatch = new devkit.api.mediaBatch(customer, filter, 20);
                sortedBatch.fetch()
                    .then(function (media){
                        $.each(media, function (i, e) {
                            mediaList.append('<li class="item"><span>'+e.get('images/original')+'</span><img src="'+e.get('images/mobile')+'" /></li>');
                        });
                        $(window).scroll(function() {   
                            if($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
                                batch.next()
                                .then(function (media){
                                    $.each(media, function (i, e) {                            
                                        mediaList.append('<li class="item"><span>'+e.get('images/original')+'</span><img src="'+e.get('images/mobile')+'" /></li>');
                                    });              
                                });
                            }
                        });
                    })
                    .fail(function (error){
                        console.log('Initial media batch error: ', error);
                    });    
            });
                    
        })
        .fail(function(error){
            console.log('Customer error: ', error);
        });
}