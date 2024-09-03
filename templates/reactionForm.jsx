/* eslint-disable multiline-ternary */
import Adapt from 'core/js/adapt';
import React, { useState } from 'react';
import { classes, compile } from 'core/js/reactHelpers';

function RatingOption({ item, rating, handleRatingChange }) {
  return (
    <label
      className={classes(['reaction__form-rating-option', `rating-option-${item.value}`, rating === item.value ? 'is-selected' : ''])}
      htmlFor={'reaction-' + item.value}
      aria-hidden={true}
    >
      <span className={classes(['reaction__form-rating-option-icon', 'icon', item.icon])}></span>
      {!item.icon && <span className='reaction__form-rating-option-label'>{item.value}</span>}
      <input
        id={`reaction-${item.value}`}
        type='radio'
        name='reaction-form-rating'
        value={item.value}
        checked={rating === item.value}
        onChange={() => handleRatingChange(item.value)}
        aria-label={item.label}
      />
    </label>
  );
}

function FormButtons({ _buttons, handleSubmit, isSubmitDisabled }) {
  return (
    <div className='reaction__form-buttons'>
      {_buttons._cancel && (
        <button type='button' className='reaction__form-button btn-text js-notify-close-btn'>
          {compile(_buttons._cancel.buttonText)}
        </button>
      )}
      {_buttons._submit && (
        <button
          type='submit'
          className={classes(['reaction__form-button btn-text js-notify-submit-btn', isSubmitDisabled && 'is-disabled'])}
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {compile(_buttons._submit.buttonText)}
        </button>
      )}
    </div>
  );
}

function RatingGroup({ _items, rating, handleRatingChange }) {
  return (
    <div className='reaction__form-ratinggroup' role='radiogroup'>
      {_items.map((item, index) => (
        <RatingOption key={item.value} item={item} rating={rating} handleRatingChange={handleRatingChange} />
      ))}
    </div>
  );
}

function FeedbackForm({ title, body, instruction, placeholder, _items, _buttons, rating, feedback, setFeedback, handleRatingChange, handleSubmit }) {
  const isSubmitDisabled = !feedback.trim();
  return (
    <form onSubmit={handleSubmit}>
      <h2 className='reaction__form-title' dangerouslySetInnerHTML={{ __html: compile(title) }}></h2>
      <p className='reaction__form-body' dangerouslySetInnerHTML={{ __html: compile(body) }}></p>
      {instruction && <p className='reaction__form-instruction' dangerouslySetInnerHTML={{ __html: compile(instruction) }}></p>}

      <textarea
        className='reaction__form-textarea'
        placeholder={placeholder}
        rows='6'
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <div className='reaction__form-bottom'>
        <RatingGroup _items={_items} rating={rating} handleRatingChange={handleRatingChange} />
        <FormButtons _buttons={_buttons} handleSubmit={handleSubmit} isSubmitDisabled={isSubmitDisabled} />
      </div>
    </form>
  );
}

function ThankYouMessage({ thankYou }) {
  return (
    <div className='reaction__form-thanks'>
      <p className='reaction__form-thanks' dangerouslySetInnerHTML={{ __html: compile(thankYou) }}></p>
    </div>
  );
}

export default function ReactionForm({ title, body, instruction, placeholder, _items, _buttons, thankYou, trackUser }) {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const _globals = Adapt.course.get('_globals');
  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const user = trackUser ? _globals._learnerInfo || null : null;
    Adapt.trigger('reaction:submitted', { feedback, rating, user });
  };

  return (
    <div className='reaction__form-inner'>
      {!isSubmitted ? (
        <FeedbackForm
          title={title}
          body={body}
          instruction={instruction}
          placeholder={placeholder}
          _items={_items}
          _buttons={_buttons}
          rating={rating}
          feedback={feedback}
          setFeedback={setFeedback}
          handleRatingChange={handleRatingChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <ThankYouMessage thankYou={thankYou} _buttons={_buttons} />
      )}
    </div>
  );
}
