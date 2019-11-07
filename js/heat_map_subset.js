var converter = function(d){
    return {
        type: d.type,
        age: d.age,
        learn: +d.learn,
        word: d.word

    };
};

var $content1 = $("#right1");
var $content2 = $("#right2");
var $content3 = $("#right3");
var $content4 = $("#right4");



d3.csv("data/heatmap.csv", converter).then(function(dataset){

    var data;

    var sheight = 300;
    var swidth = 600;
    var margin = {top: 100, bottom: 100, left:50, right:20};

    var svg = d3.select("#subset")
            .append("svg")
            .attr("height", sheight)
            .attr("width", swidth);
    var sx;
    var sy;
    var xScale;
    var xAxisTop;
    var yScale;
    var yAxis;
    var color;

    // Gradient for legend
    //Create the gradient
    var legendSvg = svg.append("g")
        .attr("transform", `translate(${margin.left*3.3},0)`)
        .attr("id", "explain-legend")
        .attr("width", "500px")
        .attr("height", "50px");

    var legendColor = legendSvg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");

    legendColor.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FFE7D5")
        .attr("stop-opacity", 1);

    legendColor.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#F84C07")
        .attr("stop-opacity", 1);


    var legend = legendSvg
        .append("rect")
        .attr("width", "300px")
        .attr("height", "20px")
        .style("fill", "url(#gradient)");

    var colorTextLeft = legendSvg.append("g")
        .attr("transform", "translate(0, 35)")
        .append("text")
        .text("0%")
        .attr("fill", "gray");

    var colorTextRight = legendSvg.append("g")
        .attr("transform", "translate(260, 35)")
        .append("text")
        .text("100%")
        .attr("fill", "gray");


    $content1.waypoint(function (direction) {

        if (direction == "down") {

            data = dataset.filter(function (d) {
                return d.word === "no" ||  d.word === "yes";
            })

            console.log(data)

            sx = d3.map(data, function (d) { return d.age }).keys();
            sy = d3.map(data, function (d) { return d.word }).keys();

            // x scale
            xScale = d3.scaleBand()
                .domain(sx)
                .range([margin.left, swidth - margin.right])
                .padding(0.1);

            xAxisTop = svg.append("g")
                .attr("transform", `translate(0, ${margin.top})`)
                .attr("class", "xaxis")
                .call(d3.axisTop(xScale).tickSize(0))
                .select(".domain").remove();

            yScale = d3.scaleBand()
                .domain(sy)
                .range([sheight - margin.bottom, margin.bottom])
                .padding(0.2);

            yAxis = svg.append("g")
                .attr("transform", `translate(${margin.left}, 0)`)
                .attr("class", "yaxis")
                .call(d3.axisLeft(yScale).tickSize(0))
                .select(".domain").remove()


            color = d3.scaleSequential()
                .interpolator(d3.interpolate("#FFE7D5","#F84C07"))
                .domain([
                    d3.min(data, function (d) { return +d.learn; }),
                    d3.max(data, function (d) { return +d.learn; })
                    
                ]);

            var rect = svg.selectAll()
                .data(data, function (d) { return d.age + ":" + d.word; })
                .enter()
                .append("rect")
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", function(d){
                    if (d.age === "16M") {
                        return 0.8;
                    }
                    else {
                        return 0;
                    }
                });



        }

    }, { offset: "50%" });


    $content2.waypoint(function (direction) {

        if (direction == "down") {
           
    var r = svg.selectAll()
       .data(data, function(d){return d.age + ":" + d.word;})
       .enter()
       .append("rect")
         .attr("x", function(d){return xScale(d.age);})
         .attr("y", function(d){return yScale(d.word)})
         .attr("rx", 2)
         .attr("rx", 2)
         .attr("width", xScale.bandwidth())
         .attr("height", yScale.bandwidth())
         .attr("fill", function(d){return color(+d.learn)})
         .attr("stroke", "none")
         .attr("stroke-width", 4)
         .style("opacity", 0.8);


    
        }

    }, { offset: "40%" });

    $content3.waypoint(function (direction) {

        if (direction == "down") {
            
            data = dataset.filter(function (d) {
                return d.word === "love" || d.word === "hate";
            })

            console.log(data)
            sy = d3.map(data, function (d) { return d.word }).keys();

            yScale.domain(sy);

            yAxis = svg.selectAll(".yaxis")
                .call(d3.axisLeft(yScale).tickSize(0))
                .select(".domain").remove();

            var r = svg.selectAll()
                .data(data, function (d) { return d.age + ":", d.word; });

            r.enter().append("rect")
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8)
            .merge(r)
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8);

            r.exit().remove();


        } 

        else if (direction == "up"){

            data = dataset.filter(function (d) {
                return d.word === "yes" || d.word === "no";
            })

            ny = d3.map(data, function (d) { return d.word }).keys();

            yScale.domain(ny);

            yAxis = svg.selectAll(".yaxis")
                .call(d3.axisLeft(yScale).tickSize(0))
                .select(".domain").remove();

            var nr = svg.selectAll()
                .data(data, function (d) { return d.age + ":", d.word; });

            nr.enter().append("rect")
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8)
                .merge(nr)
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8);

            nr.exit().remove();



        }

    }, { offset: "50%" });

    $content4.waypoint(function (direction) {

        if (direction == "down") {

            data = dataset.filter(function (d) {
                return d.word === "penis" || d.word === "vagina";
            })

            console.log(data)
            sy = d3.map(data, function (d) { return d.word }).keys();

            yScale.domain(sy);

            yAxis = svg.selectAll(".yaxis")
                .call(d3.axisLeft(yScale).tickSize(0))
                .select(".domain").remove();

            var r = svg.selectAll()
                .data(data, function (d) { return d.age + ":", d.word; });

            r.enter().append("rect")
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8)
                .merge(r)
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8);

            r.exit().remove();


        }

        else if (direction == "up") {

            data = dataset.filter(function (d) {
                return d.word === "love" || d.word === "hate";
            })

            ny = d3.map(data, function (d) { return d.word }).keys();

            yScale.domain(ny);

            yAxis = svg.selectAll(".yaxis")
                .call(d3.axisLeft(yScale).tickSize(0))
                .select(".domain").remove();

            var nr = svg.selectAll()
                .data(data, function (d) { return d.age + ":", d.word; });

            nr.enter().append("rect")
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8)
                .merge(nr)
                .attr("x", function (d) { return xScale(d.age); })
                .attr("y", function (d) { return yScale(d.word) })
                .attr("rx", 2)
                .attr("rx", 2)
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", function (d) { return color(+d.learn) })
                .attr("stroke", "none")
                .attr("stroke-width", 4)
                .style("opacity", 0.8);

            nr.exit().remove();



        }

    }, { offset: "50%" });


    
    })
