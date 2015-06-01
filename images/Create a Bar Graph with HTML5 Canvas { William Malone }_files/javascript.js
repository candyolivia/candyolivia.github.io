// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function BarGraph(ctx) {

	// Private properties and methods
	
	var that = this,
		startArr,
		endArr,
		looping = false,
		
		// Loop method adjusts the height of bar and redraws if neccessary
		loop = function () {

			var delta,
				animationComplete = true;

			// Boolean to prevent update function from looping if already looping
			looping = true;

			// For each bar
			for (var i = 0; i < endArr.length; i += 1) {
				// Change the current bar height toward its target height
				delta = (endArr[i] - startArr[i]) / that.animationSteps;
				that.curArr[i] += delta;
				// If any change is made then flip a switch
				if (delta) {
					animationComplete = false;
				}
			}
			
			// If no change was made to any bars then we are done
			if (animationComplete) {
				looping = false;
			} else {
				// Draw and call loop again
				draw(that.curArr);
				setTimeout(loop, that.animationInterval / that.animationSteps);
			}
		},
		
		// Draw method updates the canvas with the current display
		draw = function (arr) {
	
			var numOfBars = arr.length,
				barWidth,
				barHeight,
				border = 2,
				ratio,
				maxBarHeight,
				gradient,
				largestValue,
				graphAreaX = 0,
				graphAreaY = 0,
				graphAreaWidth = that.width,
				graphAreaHeight = that.height,
				i;
			
			// Update the dimensions of the canvas only if they have changed
			if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
				ctx.canvas.width = that.width;
				ctx.canvas.height = that.height;
			}
			
			// Draw the background color
			ctx.fillStyle = that.backgroundColor;
			ctx.fillRect(0, 0, that.width, that.height);
				
			// If x axis labels exist then make room	
			if (that.xAxisLabelArr.length) {
				graphAreaHeight -= 40;
			}
			
			// Calculate dimensions of the bar
			barWidth = graphAreaWidth / numOfBars - that.margin * 2;
			maxBarHeight = graphAreaHeight - 25;
			
			// Determine the largest value in the bar array
			var largestValue = 0;
			for (i = 0; i < arr.length; i += 1) {
				if (arr[i] > largestValue) {
					largestValue = arr[i];	
				}
			}
			
			// For each bar
			for (i = 0; i < arr.length; i += 1) {
				
				// Set the ratio of current bar compared to the maximum
				if (that.maxValue) {
					ratio = arr[i] / that.maxValue;
				} else {
					ratio = arr[i] / largestValue;
				}
				
				barHeight = ratio * maxBarHeight;
				
				// Turn on shadow
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 2;
				ctx.shadowColor = "#999";
					
				// Draw bar background
				ctx.fillStyle = "#333";			
				ctx.fillRect(that.margin + i * that.width / numOfBars,
					graphAreaHeight - barHeight,
					barWidth,
					barHeight);
		
				// Turn off shadow
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				ctx.shadowBlur = 0;
				
				// Draw bar color if it is large enough to be visible
				if (barHeight > border * 2) {
				
					// Create gradient
					gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
					gradient.addColorStop(1 - ratio, that.colors[i % that.colors.length]);
					gradient.addColorStop(1, "#ffffff");
					ctx.fillStyle = gradient;
					
					// Fill rectangle with gradient
					ctx.fillRect(that.margin + i * that.width / numOfBars + border,
						graphAreaHeight - barHeight + border,
						barWidth - border * 2,
						barHeight - border * 2);
				}
				
				// Write bar value
				ctx.fillStyle = "#333";
				ctx.font = "bold 12px sans-serif";
				ctx.textAlign = "center";
				// Use try / catch to stop IE 8 from going to error town
				try{
					ctx.fillText(parseInt(arr[i], 10), i * that.width / numOfBars + (that.width / numOfBars) / 2, graphAreaHeight - barHeight - 10);
				} catch (ex) {}
				
				// Draw bar label if it exists
				if (that.xAxisLabelArr[i]) {
					
					// Use try / catch to stop IE 8 from going to error town
					
					ctx.fillStyle = "#333";
					ctx.font = "bold 12px sans-serif";
					ctx.textAlign = "center";
					try{
						ctx.fillText(that.xAxisLabelArr[i],
						i * that.width / numOfBars + (that.width / numOfBars) / 2,
						that.height - 10);
					} catch (ex) {}
				}
			}
		};
		
	// Public properties and methods
	
	this.width = 300;
	this.height = 150;	
	this.maxValue;
	this.margin = 5;
	this.colors = ["purple", "red", "green", "yellow"];
	this.curArr = [];
	this.backgroundColor = "#fff";
	this.xAxisLabelArr = [];
	this.yAxisLabelArr = [];
	this.animationInterval = 100;
	this.animationSteps = 10;
	
	// Update method sets the end bar array and starts the animation
	this.update = function (newArr) {

		// If length of target and current array is different
		if (that.curArr.length !== newArr.length) {
			that.curArr = newArr;
			draw(newArr);
		} else {
			// Set the starting array to the current array
			startArr = that.curArr;
			// Set the target array to the new array
			endArr = newArr;
			// Animate from the start array to the end array
			if (!looping) {	
				loop();
			}
		}
	};
}

(function () {
	
	function createCanvas(divName) {
		
		var div = document.getElementById(divName);
		var canvas = document.createElement('canvas');
		div.appendChild(canvas);
		if (typeof G_vmlCanvasManager != 'undefined') {
			canvas = G_vmlCanvasManager.initElement(canvas);
		}	
		var ctx = canvas.getContext("2d");
		return ctx;
	}
	
	var ctx = createCanvas("graph1");
	
	var graph = new BarGraph(ctx);
	graph.maxValue = 30;
	graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
	graph.xAxisLabelArr = ["North", "East", "West", "South"];
	graph.update([Math.random() * 30, Math.random() * 30, Math.random() * 30, Math.random() * 30]);
	setInterval(function () {
		graph.update([Math.random() * 30, Math.random() * 30, Math.random() * 30, Math.random() * 30]);
	}, 1000);
	
	var ctx2 = createCanvas("graph2");
	
	var graph2 = new BarGraph(ctx2);
	graph2.margin = 2;
	graph2.width = 450;
	graph2.height = 150;
	graph2.xAxisLabelArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
	setInterval(function () {
		graph2.update([Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20]);
	}, 1000);
	
	var ctx3 = createCanvas("graph3");
	
	var graph3 = new BarGraph(ctx3);
	graph3.margin = 2;
	graph3.maxValue = 20;
	graph3.width = 450;
	graph3.height = 150;
	graph3.xAxisLabelArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	graph3.update([3, 5, 3, 4, 4, 13, 2]);
	setInterval(function () {
		graph3.update([Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20]);
	}, 1000);

}());
