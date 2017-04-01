// 百度地图API功能
var map = new BMap.Map('allmap');
map.enableScrollWheelZoom();
map.centerAndZoom(new BMap.Point(120.29,31.59), 16);

// 创建地址解析器实例
var myGeo = new BMap.Geocoder();

fetch('http://localhost:8000/output.json')
.then((res) => {
    return res.json();
})
.then((data) => {
    for(const item of data.result) {
        addMarker(item.location);
    }
})

function addMarker(location) {
    myGeo.getPoint(location, function(point){
        if (point) {
            const marker = new BMap.Marker(point, {
                enableDragging: true,
            });

            
            map.addOverlay(marker);

            marker.addEventListener('click', function(e){
                var infoWindow = new BMap.InfoWindow(location, {

                });
                marker.openInfoWindow(infoWindow);
            });
        }else{
            console.log('您选择地址没有解析到结果!', location);
        }
    }, '无锡市');
}

function openInfo(content,e){
    
}