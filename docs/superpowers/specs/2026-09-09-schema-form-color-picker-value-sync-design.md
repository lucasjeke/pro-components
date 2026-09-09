# SchemaForm ColorPicker Value Sync Design

## Problem

The SchemaForm value-type demo mirrors the editable field value into a readonly
field. Its clone helper currently spreads every object into a plain object.
When the editable ColorPicker emits an `AggregationColor` instance, spreading
that value removes its prototype methods. The readonly ColorPicker then passes
the malformed object to `@ant-design/fast-color`, which rejects it.

## Scope

- Keep the existing SchemaForm and FieldColorPicker APIs unchanged.
- Keep ColorPicker values in their native form instead of forcing a string
  format.
- Change the demo clone helper to recursively clone arrays and plain objects
  only.
- Preserve class instances such as `AggregationColor`, Dayjs, and Date.
- Remove the diagnostic console output from the value synchronization handler.

## Data Flow

1. The editable ColorPicker emits its native value.
2. SchemaForm stores that value in the editable field.
3. The demo clone helper copies arrays and plain form data recursively.
4. Rich values retain their prototype and are assigned to the readonly field.
5. The readonly ColorPicker receives a supported `AggregationColor` instance.

## Verification

- Add a focused regression test for the clone helper.
- Confirm plain nested form data is still copied without shared object state.
- Confirm an `AggregationColor` instance is preserved.
- Exercise the demo in the browser, select a preset color, and verify no Vue
  warning or `@ant-design/fast-color` error is logged.
