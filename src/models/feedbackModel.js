// models/feedbackModel.js
class FeedbackModel {
    constructor(feedback) {
      this.user_id = feedback.user_id;
      this.comment = feedback.comment;
      this.rating = feedback.rating;
    }
  }
  
  export default FeedbackModel;