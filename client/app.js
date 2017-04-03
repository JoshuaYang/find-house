// 百度地图API功能
var map = new BMap.Map('allmap');
map.enableScrollWheelZoom();
map.centerAndZoom(new BMap.Point(120.304186, 31.582261), 16);

// 创建地址解析器实例
var myGeo = new BMap.Geocoder();

fetch('../output.json')
.then((res) => {
    return res.json();
})
.then((data) => {
    for(const item of data.result) {
        addMarker(item);
    }
})

function addMarker(item) {
    myGeo.getPoint(item.location, function(point){
        if (point) {
            const marker = new BMap.Marker(point, {
                enableDragging: true,
            });

            const content = `
                <p>面积：${item.area}平</p>
                <p>每平每天：${(item.price * 12 / 365).toFixed(2)}元</p>
                <p>月租：${Math.ceil(item.area * item.price)}元</p>
                <a href="${item.link}" target="_blank">查看详情</a>
            `;

            marker.addEventListener('click', function(e){
                var infoWindow = new BMap.InfoWindow(content, {
                    title: item.title,
                });
                marker.openInfoWindow(infoWindow);
            });

            map.addOverlay(marker);
        }else{
            console.log('您选择地址没有解析到结果!', item.location);
        }
    }, '无锡市');
}
