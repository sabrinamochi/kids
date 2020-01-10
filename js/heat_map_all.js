var converter = function(d){
    return {
        type: d.type,
        age: d.age,
        learn: +d.learn,
        word: d.word

    };
};

d3.csv("data/heatmap.csv", converter).then(function(data){


    var heat_height = document.querySelector("#heatmap").clientHeight;
    var heat_width = document.querySelector("#heatmap").clientWidth;
    var margin = {top: 50, bottom: 50, left:90, right:0};

    var svg = d3.select("#heatmap")
            .append("svg")
            .attr("height", heat_height)
            .attr("width", heat_width)
            .append("g")
            .attr("transform", `translate(-30,-30)`);

    var type = d3.map(data, function (d) { return d.type }).keys();
    type.push("All");
    type.reverse();
    var month = d3.map(data, function (d) { return d.age }).keys();
    month.push("All")
    month.reverse();
    console.log(type);

    var menuType = d3.select("#typeDropdown");
    var menuMonth = d3.select("#monthDropdown");

    menuType.append("select")
        .attr("id", "menuType")
        .selectAll("option")
         .data(type)
         .enter()
         .append("option")
         .attr("value", function(d, i){return i;})
         .text(function(d){return d});

    menuMonth.append("select")
        .attr("id", "menuMonth")
        .selectAll("option")
        .data(month)
        .enter()
        .append("option")
        .attr("value", function (d, i) { return i; })
        .text(function (d) { return d });
                 
    
    var heat_x = d3.map(data, function(d){return d.age}).keys();
    var heat_y = d3.map(data, function(d){return d.word}).keys();

 // x scale
    var xScale = d3.scaleBand()
                   .domain(heat_x)
                   .range([margin.left, heat_width-margin.right])
                   .padding(0.1);

    var xAxisTop = svg.append("g")
        .attr("transform", `translate(0, ${margin.top})`)
        .attr("class", "xaxis")
        .call(d3.axisTop(xScale).tickSize(0))
        .select(".domain").remove()
    
    var xAxisDown = svg.append("g")
                   .attr("transform", `translate(0, ${heat_height-margin.bottom})`)
                   .attr("class", "xaxis")
                    .call(d3.axisBottom(xScale).tickSize(0))
                   .select(".domain").remove()

    var yScale = d3.scaleBand()
                   .domain(heat_y)
                   .range([heat_height-margin.bottom, margin.bottom])
                   .padding(0.2);

    var yAxis = svg.append("g")
                 .attr("transform", `translate(${margin.left}, 0)`)
                 .attr("class", "yaxis")
                 .call(d3.axisLeft(yScale).tickSize(0))
                 .select(".domain").remove()


    var color = d3.scaleSequential()
        .interpolator(d3.interpolate("#FFE7D5", "#F84C07"))
                  .domain([ 
                           
                            d3.min(data, function (d) { return +d.learn; }),
                            d3.max(data, function (d) { return +d.learn; })
                        ]);
    // Gradient for legend
    //Create the gradient
    var legendSvg = d3.select("#legend").append("svg")
                        .attr("width", "500px")
                        .attr("height", "50px");

    var legendColor = legendSvg.append("defs")
        .append("linearGradient")
        .attr("id","gradient")
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


    var legend = legendSvg.append("g")
                    .append("rect")
                    .attr("width", "500px")
                    .attr("height", "20px")
                    .style("fill", "url(#gradient)");

    var colorTextLeft = legendSvg.append("g")
                             .attr("transform", "translate(0, 35)")
                             .append("text")
                             .text("0%")
                             .attr("fill", "gray");

    var colorTextRight = legendSvg.append("g")
                            .attr("transform", "translate(460, 35)")
                            .append("text")
                            .text("100%")
                            .attr("fill", "gray");

    // create a tooltip
    var tooltip = d3.select("#heatmap")
        .append("div")
        .attr("class", "tooltip");

    var mouseover = function (d) {
        tooltip
            .style("visibility", "visible")
        d3.select(this)
            .style("stroke", "rgb(222, 222, 215)")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        tooltip
            .html(Math.round(d.learn*100) + "%")
            .style("left", (d3.mouse(this)[0]) + "px")
            .style("top", (d3.mouse(this)[1] -8 ) + "px");

    }
    var mouseleave = function (d) {
        tooltip
            .style("visibility", "hidden")
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }


    var rect = svg.selectAll()
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
         .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    
    var selectedType = menuType.select("select")
                        .property("value");
    var selectedMonth = menuMonth.select("select")
                        .property("value");

    menuType.on("change", function(){

        selectedType = d3.select(this)
                        .select("select")
                        .property("value");

        var newType = data.filter(function(d) {

            if (type[selectedType] === "All" && month[selectedMonth]==="All") {
                return d;
            }

            else if (type[selectedType] === "All" && month[selectedMonth] !== "All"){
                return d.age === month[selectedMonth];
            }

            else if (type[selectedType] !== "All" && month[selectedMonth] === "All") {
                return d.type === type[selectedType];
            }

            else {
            return d.age === month[selectedMonth] && d.type === type[selectedType];
            }
        });
        updateType(newType);

    })

    menuMonth.on("change", function () {

        selectedMonth = d3.select(this)
            .select("select")
            .property("value");

        var newMonth = data.filter(function (d) {

            if (month[selectedMonth] === "All" && type[selectedType] === "All") {
                return d;
            }
            else if (type[selectedType] === "All" && month[selectedMonth] !== "All"){

                return d.age === month[selectedMonth];

            }
            else if (type[selectedType] !== "All" && month[selectedMonth] === "All"){

                return d.type === type[selectedType];

            }
            else {
                return d.age === month[selectedMonth] && d.type === type[selectedType];
            }
        });

        updateMonth(newMonth);

    })

    function updateType(data) {


        rect
            .on("mouseover", "none")
            .on("mousemove", "none")
            .on("mouseleave", "none");


        var r = svg.selectAll("rect")
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
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        r.exit()
            .transition()
            .duration(1000)
            .style("opacity", 0.02);


    }


    function updateMonth(data) {

        rect
            .on("mouseover", "none")
            .on("mousemove", "none")
            .on("mouseleave", "none");


        var r = svg.selectAll("rect")
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
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        r.exit()
         .transition()
         .duration(1000)
         .style("opacity", 0.02);


    } 

    
  
    
    })
