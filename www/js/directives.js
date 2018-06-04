angular.module('app.directives', [])

.directive("selectableText", function() {
    return {
      restrict: "A",
      template: function(element) {
        return '<input type="text" readonly value="'+element[0].textContent+'">';
      }
    };
})