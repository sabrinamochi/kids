var converter = function (d) {
    return {
        type: d.type,
        age: d.age,
        learn: +d.learn,
        word: d.word

    };
};

d3.csv("data/heatmap.csv", converter).then(function (data) {


    var dheight = document.querySelector("#explain-dog").clientHeight;
    var dwidth = document.querySelector("#explain-dog").clientWidth;
    var margin = { top: 50, bottom: 50, left: 90, right: 0 };

    var svg = d3.select("#explain-dog")
        .append("svg")
        .attr("height", dheight)
        .attr("width", dwidth);



    var rect1 = svg.append('rect')
        .attr("x", dwidth/2)
        .attr("y", dheight/4)
        .attr("rx", 2)
        .attr("rx", 2)
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", "#F84C07" )
        .attr("stroke", "none")
        .attr("stroke-width", 4)
        .style("opacity", 0.8);

    svg.append("text")
        .text("mommy")
        .attr("fill", "black")
        .attr("x", dwidth/2-65)
        .attr("y", 50);

    var rect2 = svg.append('rect')
        .attr("x", dwidth / 2)
        .attr("y", dheight / 4+40)
        .attr("rx", 2)
        .attr("rx", 2)
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", "#FFE7D5")
        .attr("stroke", "none")
        .attr("stroke-width", 4)
        .style("opacity", 0.8);    

    svg.append("text")
        .text("alligator")
        .attr("fill", "black")
        .attr("x", dwidth / 2 - 65)
        .attr("y", 92);
    

})