loadOlapicSDK = function(){

    devkit = new OlapicDevKit();

    var mediaList = $('.body .container .item-list'),
        streamsNavList = $('.subnav.streams > ul');

    devkit.connectWithToken('459650359055b2722dbd12888d7cb74dc9793c2a71ed644d8203229d3fe1374f')
        .then(function(customer){
            console.log('Customer object: ', customer);
            var batch = new devkit.api.mediaBatch(customer, 'photorank', 20);
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
            customer.searchStream('Lemur')
                .then(function (stream) {
                    console.log('Lemur stream: ', stream);
                    var streamBatch = new devkit.api.mediaBatch(stream, 'photorank', 20);
                    streamBatch.fetch()
                        .then(function (media) {
                            console.log('Stream batch media: ', media);
                        })
                        .fail(function (error) {
                            console.log('Stream batch error: ', error);
                        });
                })
                .fail(function (error) {
                    console.log('Stream search error: ', error);
                });
//             var streams = new devkit.api.stream(customer);
//             console.log(streams);
//             streams.fetch()
//                 .then(function (stream) {
//                     console.log(stream);
//                 })
//                 .fail(function (error) {
//                     console.log('Get stream error: ', error);
//                 });
        })
        .fail(function(error){
            console.log('Customer error: ', error);
        });
}