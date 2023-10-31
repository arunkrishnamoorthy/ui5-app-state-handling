sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                this.getRouter().getRoute("RouteView1").attachPatternMatched(this._handleRouteMatched, this);
            },

            getRouter: function(){
                return this.getOwnerComponent().getRouter();
            },

            _handleRouteMatched: function(oEvent) {
                debugger;
                this.getAppStateKeyOnInbound();
            },

            getAppState: async function() {
                let oAppState = await sap.ushell.Container
                .getService("CrossApplicationNavigation")
                .createEmptyAppStateAsync(this.getOwnerComponent());
                return oAppState;
            },
    
            setAppState: function(oAppState) {
                let oDataToSave = {
                    year: '2023',
                    month: '11',
                    filters: [1,2,3]
                };
                oAppState.setData(oDataToSave);
                oAppState.save();
                return this;
            },
    
            updateUrlWithState: function(oAppState) {
                let oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
                let sOldHash = oHashChanger.getHash();
                let sNewHash;
                if(sOldHash){
                 sNewHash = sOldHash.replace(/(?:sap-iapp-state=)([^?&=]+)/.exec(sOldHash)[1],oAppState.getKey());
                } else {
                 sNewHash = "?" + "sap-iapp-state=" + oAppState.getKey();
                }
                oHashChanger.replaceHash(sNewHash);
            },
    
            getAppStateKeyOnInbound: function() {
                let oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
                let sHash = oHashChanger.getHash()
                // let sAppStateKey = /(?:sap-iapp-state=)([^&=]+)/.exec(sHash)[1];
                let sAppStateKey = /(?:sap-iapp-state=)([^?&=]+)/.exec(sHash)[1];
                let oComponent = this.getOwnerComponent();
                sap.ushell.Container
                    .getServiceAsync("CrossApplicationNavigation")
                    .then((oAppState) => {
                        oAppState.getAppState(oComponent,sAppStateKey).then(function(state) {
                            let data = state.getData();
                            // the data variable contains all the stored variables and filters
                        })
                    });
            },

            handlePress: async function() {
                let oAppState = await this.getAppState();
                this.setAppState(oAppState)
                    .updateUrlWithState(oAppState);
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                oCrossAppNavigator.toExternal({
                    target: {
                        semanticObject: "timesheet",
                        action: "self"
                    },
                    params: {
                        "parameter" : "test"
                    },
                    appStateKey : oAppState.getKey()
                })
            }
        });
    });
