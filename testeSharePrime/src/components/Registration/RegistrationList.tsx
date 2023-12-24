import * as React from 'react';
import { Announced } from '@fluentui/react/lib/Announced';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, CheckboxVisibility } from '@fluentui/react/lib/DetailsList';
// import {IconButton } from '@fluentui/react'
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
// import { carouselData } from '../../services/carouselData';
import { RegistrationForm } from './RegistrationForm';
import { ConfirmationDialog } from '../Dialog/ConfirmationDialog';
import { EditForm } from './EditForm';
import axios from 'axios';
import { SuccessMessage } from '../Dialog/SucessMessage';
// import { SuccessMessage } from '../Dialog/SucessMessage';

const classNames = mergeStyleSets({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerForm: {
    display: 'flex',
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '10px',
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});


interface IDetailsListDocumentsExampleState {
  columns: IColumn[];
  items: ICarouselItem[];
  isCompactMode: boolean;
  showSuccessMessage: boolean;
  subText: string
}

interface ICarouselItem {
  order: number;
  key: string;
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export class RegistrationList extends React.Component<{}, IDetailsListDocumentsExampleState> {
  private _selection: Selection;
  
  private _copyAndSort<T>(items: T[], columnKey: number, isSortedDescending?: boolean): T[] {
    const order = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[order] < b[order] : a[order] > b[order]) ? 1 : -1));
  }

 

  private _onColumnClick = (_ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          columns: newColumns,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = this._copyAndSort(items, currColumn.data!, currColumn.isSortedDescending);
    this.setState({
      items: newItems,
    });
  };

  private updateListAfterDeletion = (deletedItemId: number): void => {
    // Obtenha os dados mais recentes da API e atualize o estado da lista
      axios.get<ICarouselItem[]>('https://6584f29b022766bcb8c7b0b2.mockapi.io/api/carouselData/items')
      .then(response => {
        console.log('Resposta da API:', response.data);
        const updatedItems = response.data.filter(item => item.id !== deletedItemId).sort((a, b) => a.order - b.order);
        this.setState({ items: updatedItems, showSuccessMessage: true, subText: 'Item excluído' });

        // const updatedItems = response.data.filter(item => item.id !== deletedItemId).sort((a, b) => a.order - b.order);
        // window.alert('Ok')
        // this.setState({ items: updatedItems });
      })
      .catch(error => {
        console.error('Erro na solicitação de exclusão:', error);
        this.setState({ showSuccessMessage: true });
      });
  };
  

  // private updateListAfterDeletion = (deletedItemId: number): void => {
    

  //   // Obtenha os dados mais recentes da API e atualize o estado da lista
  //   axios.get<ICarouselItem[]>('https://6584f29b022766bcb8c7b0b2.mockapi.io/api/carouselData/items')
  //     .then(response => {
  //       // Ordena os itens com base no campo "order"
  //       const updatedItems = response.data.filter(item => item.id !== deletedItemId).sort((a, b) => a.order - b.order);
  //       window.alert('Ok')
  //       this.setState({ items: updatedItems });
  //     })
  //     .catch(error => console.error('Error fetching carousel data:', error));

  // };
  
  private updateListAfterEvent = (): void => {
    // Obtenha os dados mais recentes da API e atualize o estado da lista
    axios.get<ICarouselItem[]>('https://6584f29b022766bcb8c7b0b2.mockapi.io/api/carouselData/items')
      .then(response => {
        // Ordena os itens com base no campo "order"
        const sortedItems = response.data.sort((a, b) => a.order - b.order);
        this.setState({ items: sortedItems, showSuccessMessage: true, subText: 'Imagem Cadastrada' });
      })
      .catch(error =>
      {    
        console.error('Error fetching carousel data:', error);
        this.setState({ showSuccessMessage: true });
      }
        );
  };
  constructor(props: {}) {
    super(props);

    const columns: IColumn[] = [
      {
        key: 'column1',
        name: 'ID',
        fieldName: 'order',
        minWidth: 20,
        maxWidth: 40,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'number',
        isPadded: true,
      },
      {
        key: 'column2',
        name: 'Title',
        fieldName: 'title',
        minWidth: 195,
        maxWidth: 300,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'column3',
        name: 'Description',
        fieldName: 'description',
        minWidth: 195,
        maxWidth: 300,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'column4',
        name: 'URL Arquivo',
        fieldName: 'image',
        minWidth: 195,
        maxWidth: 300,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'column5',
        name: 'URL Direcionamento',
        fieldName: 'link',
        minWidth: 195,
        maxWidth: 300,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isPadded: true,
      },
      // Coluna do ícone da lixeira
      {
        key: 'deleteIcon',
        name: "",
        minWidth: 16,
        maxWidth: 16,
        isRowHeader: true,
        onRender: (
          item: ICarouselItem
          ) => (
          <>
            <ConfirmationDialog idItem={item.id} updateListAfterDeletion={this.updateListAfterDeletion} />
            </>
        ),
      },

      // Coluna do ícone de edição
      {
        key: 'editIcon',
        name: "",
        minWidth: 16,
        maxWidth: 16,
        isRowHeader: true,
        onRender: (
          item: ICarouselItem
          ) => (
          <>
            <EditForm updateListAfterEdit={this.updateListAfterEvent} key={''} order={item.order} id={item.id} title={item.title} description={item.description} urlArquivo={item.image} urlDirecionamento={item.link} />
          </>
        ),
      },
    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({});
      },
      getKey: this._getKey,
    });

    this.state = {
      items: [],
      columns,
      isCompactMode: true,
      showSuccessMessage: false,
      subText: ""
    };
  }

  componentDidMount() {
    // Fetch data from the API when the component mounts
    axios.get<ICarouselItem[]>('https://6584f29b022766bcb8c7b0b2.mockapi.io/api/carouselData/items')
      .then(response => {
        // Ordena os itens com base no campo "order"
        const sortedItems = response.data.sort((a, b) => a.order - b.order);
        this.setState({ items: sortedItems });
      })
      .catch(error => console.error('Error fetching carousel data:', error));
  }

  public render() {
    const { columns, isCompactMode, items, showSuccessMessage, subText } = this.state;
  
    return (
      <div className={classNames.container}>
        <div className={classNames.headerForm}>
          <div><span style={{ fontWeight: '700' }}>Cadastro de imagens</span></div>
          <div><RegistrationForm  updateListAfterRegister={this.updateListAfterEvent}/></div>
        </div>
  
        <div style={{ maxWidth: '100%', overflowX: 'auto', padding: '20px', margin: '10px', background: 'white' }}>
          <div className={classNames.controlWrapper}>
            <Announced message={`Number of items: ${items.length}.`} />
            <MarqueeSelection selection={this._selection}>
              <DetailsList
                items={items}
                columns={columns}
                compact={isCompactMode}
                selectionMode={SelectionMode.multiple}
                setKey="multiple"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                selection={this._selection}
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkboxVisibility={CheckboxVisibility.hidden}
              />
            </MarqueeSelection>
          </div>
        </div>
  
        {showSuccessMessage && (
          <SuccessMessage
            onCloseDialog={() => this.setState({ showSuccessMessage: false })}
            subText={subText}
          />
        )}
      </div>
    );
  }

  private _getKey(item: any, _index?: number): string {
    return item.key;
  }
}