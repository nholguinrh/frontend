export class Page<T> {

  number: number = 0;
  numberOfElements: number = 0;
  totalElements: number = 0;
  totalPages:number = 0;
  
  currentPage: number = 0;
  minPage: number = 0;
  maxPage: number = 0;
  totalOfPages: number = 0;
  totalOfRecords : number = 0;  
  pages : number[] = [];
  
  content? : T[];
  data? : T[];

  constructor(){}

  init( otherpage : Page<any> ){
    this.number = otherpage.data['number'];
    this.numberOfElements = otherpage.data['numberOfElements'];
    this.totalElements = otherpage.data['totalElements'];
    this.totalPages = otherpage.data['totalPages'];    
    this.prepare();
    
    this.content = [];
    if( otherpage.content != null ){
      for(let i=0;i<otherpage.content.length;i++){
        const id: number = otherpage.content[i].id;
        const selected: boolean = false;
        this.content[i] = {selected, ...otherpage.content[i]};     
      } 
    } else if (otherpage.data['content'] != null ) {
      for(let i=0;i<otherpage.data['content'].length;i++){
        const id: number = otherpage.data['content'][i].id;
        const selected: boolean = false;
        this.content[i] = {selected, ...otherpage.data['content'][i]};     
      } 
    }
  }
  
  prepare(){
    this.currentPage = this.number + 1;
    this.totalOfRecords = this.totalElements;
    this.totalOfPages = this.totalPages;
    
    this.minPage = this.currentPage - 2;
    if (this.minPage < 1) {
      this.minPage = 1;
    }
    this.maxPage = this.currentPage + 2;
    if (this.maxPage > this.totalOfPages) {
      this.maxPage = this.totalOfPages;
    }
    if( (this.maxPage - this.minPage)<2 && this.maxPage < this.totalOfPages ){
      let faltantes = 2-(this.maxPage - this.minPage);
      if( this.totalOfPages >= (this.maxPage+faltantes) ){
        this.maxPage += faltantes;
      }else{
        this.maxPage = this.totalOfPages;
      }
    }
    for (let i = 0; i <= (this.maxPage - this.minPage)+1; i++ ){
      this.pages[i] = this.minPage + i;
    }
    this.pages.splice((this.maxPage - this.minPage)+1, this.pages.length - ((this.maxPage - this.minPage )+1));
  }
}

