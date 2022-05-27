export const style = `
<style>
    html, body { 
        display: flex;
        position: relative;
        width:100%;
        height: 100%;
        background-color: #FAFAFA;
        color: #171717;
        margin:0;
        box-sizing: border-box;
    }

    main {
        height:100%;
        width:100%;
        display: flex;
        flex-direction: column;
    }

    .list {
        overflow-y: overlay;
        overflow-x: hidden;
        display: grid;
        justify-content: start;
        padding: 4px;
        padding-left: 64px;
        grid-row-gap: 8px;
    }

    .item { 
        display: grid;
        align-items: center;
        justify-items: start;
        grid-template-columns: 32px auto;
        padding: 4px;
    }

    .go-up {
        margin-bottom: 16px;
    }

    a {
        color: #171717;
        text-decoration: none;
    }

    .index {
        font-weight: 600;
        border: 1px dotted #FAFAFA;
        background-color: #a3a3a3;
    }
    a:hover, .item:hover {
        background-color: #dedede;
        color: #171717;
    }

    .icon {
        margin-right:4px;
    }
    svg {
        width: 24px;
        height: 24px;
    }

    .list::-webkit-scrollbar {
        width: 16px;
    }

    .list::-webkit-scrollbar-track {
        border: 2px solid #fafafa;
        border-left: 8px solid #fafafa;
        background-color: #fafafa;
    }

    .list::-webkit-scrollbar-thumb {
        background-color: #a3a3a3;
        border-left: 8px solid #fafafa;
  }
</style>
`;
