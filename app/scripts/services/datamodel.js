'use strict';

angular.module('dashApp.service', []);

angular.module('dashApp.service')
  .factory('RandomTopNDataModel', function (WidgetDataModel, $interval) {
    function RandomTopNDataModel() {
    }

    RandomTopNDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RandomTopNDataModel.prototype.init = function () {
      this.intervalPromise = $interval(function () {
        var topTen = _.map(_.range(0, 10), function (index) {
          return {
            name: 'item' + index,
            value: Math.floor(Math.random() * 100)
          };
        });
        this.updateScope(topTen);
      }.bind(this), 500);
    };

    RandomTopNDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomTopNDataModel;
  })
  .factory('RandomTimeSeriesDataModel', function (WidgetDataModel, $interval) {
    function RandomTimeSeriesDataModel() {
    }

    RandomTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RandomTimeSeriesDataModel.prototype.init = function () {
      var max = 30;
      var data = [];
      var chartValue = 50;

      function nextValue() {
        chartValue += Math.random() * 40 - 20;
        chartValue = chartValue < 0 ? 0 : chartValue > 100 ? 100 : chartValue;
        return chartValue;
      }

      var now = Date.now();
      for (var i = max - 1; i >= 0; i--) {
        data.push({
          timestamp: now - i * 1000,
          value: nextValue()
        });
      }
      var chart = {
        data: data,
        max: max,
        chartOptions: {
          vAxis: {}
        }
      };
      this.updateScope(chart);

      this.intervalPromise = $interval(function () {
        data.shift();
        data.push({
          timestamp: Date.now(),
          value: nextValue()
        });

        var chart = {
          data: data,
          max: max
        };

        this.updateScope(chart);
      }.bind(this), 1000);
    };

    RandomTimeSeriesDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomTimeSeriesDataModel;
  });
