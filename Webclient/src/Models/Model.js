
// root of model hierarchy; will put stuff here that should be common to
// all kinds of models in the system
class Model {
  errorAbstractMethodCalled(name) {
    console.log("Called abstract method '" + name + "' on an instance of '" +
      this.constructor.name + "', which should have been overriden.");
    console.log((new Error).stack);
    window.alert("Internal Error:  abstract method called.  Please reload page.  (Check console to debug.)")
  }
}

export default Model;
