var x = { _mongooseOptions: {},
  mongooseCollection: 
   { collection: { s: "[Object]" },
     opts: { bufferCommands: true, capped: false },
     name: 'schemes',
     collectionName: 'schemes',
     conn: 
      { base: "[Object]",
        collections: "[Object]",
        models: "[Object]",
        config: "[Object]",
        replica: false,
        hosts: null,
        host: 'localhost',
        port: 27017,
        user: undefined,
        pass: undefined,
        name: 'pricingEngine',
        options: "[Object]",
        otherDbs: [],
        _readyState: 1,
        _closeCalled: false,
        _hasOpened: true,
        _listening: true,
        _events: "[Object]",
        db: "[Object]" },
     queue: [],
     buffer: false },
  model: 
   { function:"model",
     hooks: { _pres: "[Object]", _posts: {} },
     base: 
      { connections: "[Object]",
        plugins: [],
        models: "[Object]",
        modelSchemas: "[Object]",
        options: "[Object]" },
     modelName: 'scheme',
     model: "[Function: model]",
     db: 
      { base: "[Object]",
        collections: "[Object]",
        models: "[Object]",
        config: "[Object]",
        replica: false,
        hosts: null,
        host: 'localhost',
        port: 27017,
        user: undefined,
        pass: undefined,
        name: 'pricingEngine',
        options: "[Object]",
        otherDbs: [],
        _readyState: 1,
        _closeCalled: false,
        _hasOpened: true,
        _listening: true,
        _events: "[Object]",
        db: "[Object]" },
     discriminators: undefined,
     schema: 
      { paths: "[Object]",
        subpaths: {},
        virtuals: "[Object]",
        nested: "[Object]",
        inherits: {},
        callQueue: "[Object]",
        _indexes: [],
        methods: "[Object]",
        statics: {},
        tree: "[Object]",
        _requiredpaths: undefined,
        discriminatorMapping: undefined,
        _indexedpaths: undefined,
        s: "[Object]",
        options: "[Object]",
        _events: {} },
     collection: 
      { collection: "[Object]",
        opts: "[Object]",
        name: 'schemes',
        collectionName: 'schemes',
        conn: "[Object]",
        queue: [],
        buffer: false },
     _events: {} },
  schema: 
   { paths: 
      { orders: "[Object]",
        'metadata.name': "[Object]",
        'metadata.toIds': "[Object]",
        'metadata.userID': "[Object]",
        'metadata.createdBy': "[Object]",
        'metadata.creationTime': "[Object]",
        'metadata.lastUpdated': "[Object]",
        'metadata.lastUpdatedBy': "[Object]",
        'metadata.location': "[Object]",
        'metadata.published': "[Object]",
        'metadata.type': "[Object]",
        'metadata.defaultLife': "[Object]",
        'behavior.maximumUsages': "[Object]",
        'behavior.startDate': "[Object]",
        'behavior.endDate': "[Object]",
        'behavior.discountType': "[Object]",
        'behavior.discount': "[Object]",
        'behavior.serviceRateCategoryDiscounts': "[Object]",
        'behavior.advancePaidPoints': "[Object]",
        'behavior.doctorLevelDiscounts': "[Object]",
        'behavior.modeOfPaymentDiscounts': "[Object]",
        'behavior.billValueDiscounts': "[Object]",
        'behavior.cumulativeAmountPoints': "[Object]",
        'behavior.locationOfServices': "[Object]",
        'behavior.serviceLevelDiscounts': "[Object]",
        'behavior.createdAt': "[Object]",
        'behavior.updateAt': "[Object]",
        _id: "[Object]",
        __v: "[Object]" },
     subpaths: {},
     virtuals: { id: "[Object]" },
     nested: { metadata: true, behavior: true },
     inherits: {},
     callQueue: [ "[Object]", "[Object]", "[Object]" ],
     _indexes: [],
     methods: 
      { beforeSaveDefaultValidation: "[Function]",
        beforeSaveCouponValidation: "[Function]",
        beforeSaveGiftCardValidation: "[Function]",
        beforeSaveAddOnValidation: "[Function]" },
     statics: {},
     tree: 
      { orders: "[Object]",
        metadata: "[Object]",
        behavior: "[Object]",
        _id: "[Object]",
        id: "[Object]",
        __v: [{Function: Number}] },
     _requiredpaths: undefined,
     discriminatorMapping: undefined,
     _indexedpaths: undefined,
     s: { hooks: "[Object]", queryHooks: "[Object]" },
     options: 
      { id: true,
        noVirtualId: false,
        _id: true,
        noId: false,
        validateBeforeSave: true,
        read: null,
        shardKey: null,
        autoIndex: null,
        minimize: true,
        discriminatorKey: '__t',
        versionKey: '__v',
        capped: false,
        bufferCommands: true,
        strict: true,
        pluralization: true },
     _events: {} },
  op: 'update',
  options: {},
  _conditions: { 'metadata.name': 'mib2' },
  _fields: undefined,
  _update: { '$set': { orders: [], metadata: "[Object]", behavior: "[Object]", __v: 0 } },
  _path: undefined,
  _distinct: undefined,
  _collection: 
   { collection: 
      { collection: "[Object]",
        opts: "[Object]",
        name: 'schemes',
        collectionName: 'schemes',
        conn: "[Object]",
        queue: [],
        buffer: false },
     collectionName: 'schemes' },
  _traceFunction: undefined,
  _castError: null,
  _count: "[Function]",
  _execUpdate: "[Function]",
  _find: "[Function]",
  _findOne: "[Function]",
  _findOneAndRemove: "[Function]",
  _findOneAndUpdate: "[Function]" };

  console.log(x.mongooseCollection.collection);