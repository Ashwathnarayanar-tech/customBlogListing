import React, { Component } from 'react';
import {FilterOptions, DatePicker } from 'vtex.styleguide'

function DatePickerObject({ value, onChange }) {
  return (
    <div className="w-100">
      <DatePicker
        value={value || new Date()}
        onChange={date => {
          onChange(date)
        }}
        locale="pt-BR"
      />
    </div>
  )
}

function DatePickerRangeObject({ value, onChange }) {
  return (
    <div className="flex flex-column w-100">
      <br />
      <DatePicker
        label="from"
        value={(value && value.from) || new Date()}
        onChange={date => {
          onChange({ ...(value || {}), from: date })
        }}
        locale="pt-BR"
      />
      <br />
      <DatePicker
        label="to"
        value={(value && value.to) || new Date()}
        onChange={date => {
          onChange({ ...(value || {}), to: date })
        }}
        locale="pt-BR"
      />
    </div>
  )
}

class DateFilter extends Component {
    constructor() {
      super()
      this.state = { statements: [] }
      this.simpleInputVerbs = this.simpleInputVerbs.bind(this)
    }
  
    simpleInputVerbs() {
      return [
        {
          label: 'is',
          value: '=',
          object: props => <SimpleInputObject {...props} />,
        },
        {
          label: 'is not',
          value: '!=',
          object: props => <SimpleInputObject {...props} />,
        },
        {
          label: 'contains',
          value: 'contains',
          object: props => <SimpleInputObject {...props} />,
        },
      ]
    }
  
    render() {
      return (
        <FilterOptions
          alwaysVisibleFilters={['invoicedate']}
          statements={this.state.statements}
          onChangeStatements={statements => this.setState({ statements })}
          clearAllFiltersButtonLabel="Clear Filters"
          options={{
            invoicedate: {
              label: 'Invoiced date',
              renderFilterLabel: st => {
                if (!st || !st.object) return 'All'
                return `${
                  st.verb === 'between'
                    ? `between ${st.object.from} and ${st.object.to}`
                    : `is ${st.object}`
                }`
              },
              verbs: [
                {
                  label: 'is',
                  value: '=',
                  object: props => <DatePickerObject {...props} />,
                },
                {
                  label: 'is between',
                  value: 'between',
                  object: props => <DatePickerRangeObject {...props} />,
                },
              ],
            }
          }}
        />
      )
    }
  }
  export default DateFilter;