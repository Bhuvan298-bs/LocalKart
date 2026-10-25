export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  onRightIconClick,
  className = '',
  ...rest
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {IconLeft && (
          <span className="input-icon-left">
            <IconLeft size={16} />
          </span>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input ${error ? 'has-error' : ''} ${IconLeft ? 'has-left-icon' : ''} ${IconRight ? 'has-right-icon' : ''}`}
          {...rest}
        />

        {IconRight && (
          <span
            className="input-icon-right"
            onClick={onRightIconClick}
            role={onRightIconClick ? 'button' : undefined}
          >
            <IconRight size={16} />
          </span>
        )}
      </div>

      {error ? (
        <span className="form-error">{error}</span>
      ) : helperText ? (
        <span className="form-helper">{helperText}</span>
      ) : null}
    </div>
  );
}
