import Select, { ActionMeta, SingleValue } from "react-select";
import styled from "styled-components";
import { IOption } from "../interfaces";

interface AutoCompleteSelectProps {
  placeholder?: string;
  menuPortalTarget?: HTMLElement | null;
  width?: number;
  opcoes?: IOption[];
  onChange: (
    novaOpcao: SingleValue<IOption>,
    acao: ActionMeta<IOption>
  ) => void;
}

const AutoCompleteSelect = (props: AutoCompleteSelectProps) => {
  const { opcoes, onChange, placeholder, menuPortalTarget, width } = props;

  return (
    <>
      <Select
        styles={{
          container: () => {
            return {
              width: `${width || 30}%`,
            };
          },
        }}
        menuPortalTarget={menuPortalTarget || document.body}
        isSearchable
        placeholder={placeholder}
        isClearable
        getOptionValue={(option) => `${option._id}`}
        getOptionLabel={(option) => `${option.nome}`}
        options={opcoes}
        onChange={onChange}
      />
    </>
  );
};

export default AutoCompleteSelect;
