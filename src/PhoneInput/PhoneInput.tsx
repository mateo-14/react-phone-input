import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { getCountryCodeForRegionCode, getSupportedRegionCodes, parsePhoneNumber } from 'awesome-phonenumber'
import { useMemo } from 'react'

const countries = getSupportedRegionCodes()

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  regionCode?: string
  onChangeRegionCode: (regionCode: string) => void
}

export default function PhoneInput({ value, onChange, regionCode, onChangeRegionCode }: PhoneInputProps) {
  const parsedNumber = useMemo(
    () =>
      parsePhoneNumber(value, {
        regionCode
      }),
    [value, regionCode]
  )
  const countryCode = useMemo(
    () => (parsedNumber.regionCode ? getCountryCodeForRegionCode(parsedNumber?.regionCode).toString() : null),
    [parsedNumber?.regionCode]
  )
  let inputValue = parsedNumber?.number?.national ?? value
  if (!parsedNumber.valid && parsedNumber.regionCode) {
    const countryCode = getCountryCodeForRegionCode(parsedNumber.regionCode).toString()
    if (countryCode) {
      inputValue = inputValue.replace(`+${countryCode}`, '')
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedNumber = parsePhoneNumber(event.target.value, {
      regionCode
    })

    onChange(parsedNumber.number?.e164 ?? parsedNumber.number?.input ?? event.target.value)
  }

  const handleListboxChange = (regionCode: string) => {
    let valeuWithoutCountryCode = value
    if (countryCode) {
      valeuWithoutCountryCode = value.replace(`+${countryCode}`, '')
    }

    const parsedNumber = parsePhoneNumber(valeuWithoutCountryCode, {
      regionCode
    })

    onChangeRegionCode(regionCode)
    onChange(parsedNumber.number?.e164 ?? parsedNumber.number?.input ?? value)
  }

  return (
    <div>
      <Listbox value={regionCode} onChange={handleListboxChange}>
        <ListboxButton>
          {regionCode} +{countryCode}
        </ListboxButton>
        <ListboxOptions anchor="bottom">
          {countries.map((countryCode) => (
            <ListboxOption key={countryCode} value={countryCode} className="data-[focus]:bg-blue-100">
              {countryCode}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      <input type="text" onChange={handleChange} value={inputValue} placeholder="Phone" disabled={!regionCode} />
    </div>
  )
}
